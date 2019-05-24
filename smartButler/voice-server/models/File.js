"use strict";
const Database = require("../core/database");
const Mongo = require("mongodb");
const Versionable = require("./Versionable");
const assert = require("chai").assert;

class File extends Versionable {
	get validation() {
		return {
			name: {
				type: "string",
				required: true,
			},
			author: {
				type: "object",
				required: false,
			},
			modified: {
				type: "string",
				required: false,
			},
			fileType: {
				type: "string",
				required: true,
			},
			keywords: {
				type: "object",
				required: false,
			},
		};
	}

	getAll(user) {
		if (!user) {
			// User needs to be logged in
			return {
				error: true,
				message: "User must be logged in",
			};
		}

		return Database.getClient().then((client) => {
			return client
				.db(Database.getDb())
				.collection("files")
				.find({
					teamId: Mongo.ObjectID(user.teamId),
				});
		});
	}

	getOne(id, user) {
		if (!user) {
			// User needs to be logged in
			return {
				error: true,
				message: "User must be logged in",
			};
		}

		return Database.getClient().then((client) => {
			return client
				.db(Database.getDb())
				.collection("files")
				.findOne({
					_id: new Mongo.ObjectId(id),
					teamId: new Mongo.ObjectId(user.teamId),
				});
		});
	}

	create(data, user) {
		// Remove blank keywords (there will always be one bc of the js)
		if (!data.keywords) {
			data.keywords = [];
		}

		data.keywords = data.keywords.filter((keyword) => {
			return keyword.length > 1;
		});

		// Validate model
		const validationErrors = this.validate(data, this.validation);
		if (validationErrors.length > 0) {
			return {
				validationErrors: validationErrors,
			};
		}

		// Create the new document
		const modified = new Date();
		let file = {
			locked: false,
			name: data.name,
			modified: modified,
			author: user,
			keywords: data.keywords,
			fileType: data.fileType,
			teamId: user.teamId,
			versions: [
				{
					name: data.name,
					modified: modified,
					author: user,
					keywords: data.keywords,
					fileType: data.fileType,
				},
			],
		};

		// Insert new document
		return Database.getClient().then((client) => {
			return client
				.db(Database.getDb())
				.collection("files")
				.insertOne(file);
		});
	}

	delete(id, user) {
		if (id.length != 24) {
			return null;
		}

		return Database.getClient().then((client) => {
			return client
				.db(Database.getDb())
				.collection("files")
				.deleteOne({
					_id: new Mongo.ObjectID(id),
					teamId: user.teamId,
					$or: [
						{
							locked: false,
						},
						{
							"locked.at": {
								$lte: new Date() - 1000 * 3600 * 24 * 1,
							},
						},
						{
							"locked.by._id": user._id,
						},
					],
				});
		});
	}

	update(oldFile, newFile, user) {
		const validationErrors = this.validate(newFile, this.validation);
		if (validationErrors.length > 0) {
			return validationErrors;
		}

		// TODO: check user is part of team that owns this file

		const modified = new Date();
		oldFile.name = newFile.name;
		oldFile.modified = modified;
		oldFile.author = user;
		oldFile.keywords = newFile.keywords;
		oldFile.fileType = newFile.fileType;
		oldFile.versions.push({
			name: newFile.name,
			modified: modified,
			author: user,
			keywords: newFile.keywords,
			fileType: newFile.fileType,
		});

		return Database.getClient().then((client) => {
			return client
				.db(Database.getDb())
				.collection("files")
				.updateOne(
					{
						_id: new Mongo.ObjectID(oldFile._id),
					},
					{
						$set: oldFile,
					}
				);
		});
	}

	find(query, user) {
		// TODO: sanitize and validate query

		if (!query.search) {
			return Database.getClient().then((client) => {
				return client
					.db(Database.getDb())
					.collection("files")
					.find();
			});
		}

		return Database.getClient().then((client) => {
			return client
				.db(Database.getDb())
				.collection("files")
				.find({
					$and: [
						{ $text: { $search: `${query.search}` } },
						{ teamId: new Mongo.ObjectID(user.teamId) },
					],
				});
		});
	}

	lock(fileId, user) {
		return Database.getClient().then((client) => {
			return client
				.db(Database.getDb())
				.collection("files")
				.updateOne(
					{
						_id: new Mongo.ObjectID(fileId),
						teamId: user.teamId, // Check user is in the team that owns this file
						$or: [
							{
								locked: false,
							},
							{
								"locked.at": {
									$lte: new Date() - 1000 * 3600 * 24 * 1,
								},
							},
						],
					},
					{
						$set: {
							locked: {
								by: user,
								at: new Date(),
							},
						},
					}
				);
		});
	}

	unlock(fileId, user) {
		let result = Database.getClient().then((client) => {
			return client
				.db(Database.getDb())
				.collection("files")
				.findOne({
					_id: new Mongo.ObjectID(fileId),
					teamId: user.teamId,
					$or: [
						{
							locked: false,
						},
						{
							"locked.at": {
								$lte: new Date() - 1000 * 3600 * 24 * 1,
							},
						},
						{
							"locked.by._id": new Mongo.ObjectID(user._id),
						},
					],
				});
		});

		result.then((file) => {
			if (!file) {
				return null;
			}

			return Database.getClient().then((client) => {
				return client
					.db(Database.getDb())
					.collection("files")
					.updateOne(
						{
							_id: file._id,
						},
						{
							$set: {
								locked: false,
							},
						}
					);
			});
		});

		return result;
	}
}

module.exports = new File();
