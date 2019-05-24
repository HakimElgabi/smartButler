"use strict";
const Config = require("../server.config");
// const MongoClient = require("mongodb").MongoClient;
/**
 * Wrapper for mongoose, using the singleton pattern
 *
 * @example
 * ```js
 * 	const Database = require('./database')
 * 	this.db = new Database().getInstance()
 * ```
 */
class Database {
	constructor() {
		this.client = null;
	}

	/**
	 * Save connection to singleton
	 *
	 * @param {Promise<typeof import('mongodb').MongoClient>} client
	 */
	setClient(client) {
		this.client = client;
	}

	/**
	 * Get database client instance
	 *
	 * @returns {Promise<import('mongodb').MongoClient>}
	 */
	getClient() {
		return this.client;
	}

	/**
	 * Get name of primary database
	 *
	 * @returns {string}
	 */
	getDb() {
		return Config.db.database;
	}
}

class DatabaseSingleton {
	constructor() {
		if (!DatabaseSingleton.instance) {
			DatabaseSingleton.instance = new Database();
		}
	}

	/**
	 * Gets instance of database class
	 *
	 * @returns {Database}
	 */
	getInstance() {
		return DatabaseSingleton.instance;
	}
}

module.exports = new DatabaseSingleton().getInstance();
