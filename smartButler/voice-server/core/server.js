"use strict";
// const flash = require("connect-flash");
// const cookieParser = require("cookie-parser");
// const MongoClient = require("mongodb").MongoClient;

class Server {
  constructor() {
    this.createError = require("http-errors");
    this.express = require("express");
    this.path = require("path");
    this.app = this.express();
    this.config = require("../server.config");
    this.router = require("./routes");
  }

  /**
   * Initialise the server
   *
   * @returns void
   */
  init() {
    this.initView();
    this.initMiddleware();
    this.initRoutes();
    this.catch404();
  }

  initDatabase() {
    this.db.setClient(
      MongoClient.connect(this.config.db.url, {
        useNewUrlParser: true,
      })
    );
  }

  /**
   * Setups up the view engine and defines path for static assets
   *
   * @returns void
   */
  initView() {
    this.app.set("views", this.config.view.folder);
    this.app.set("view engine", this.config.view.engine);
    this.app.use(this.express.static(this.config.view.static));
  }

  /**
   * Initial setup of all middleware for running the back end
   *
   * @return void
   */
  initMiddleware() {
    this.app.use(this.express.json());
    this.app.use(this.express.urlencoded({ extended: true }));
  }

  /**
   * Loads initial routes
   *
   * @return void
   */
  initRoutes() {
    // Have moved all routes to server/core/routes.js
    this.app.use(this.router);
  }

  /**
   * Sets up middleware to catch all 404 error and pass it to http-errors
   *
   * @return void
   */
  catch404() {
    // catch 404 and forward to error handler
    this.app.use(
      function(req, res, next) {
        next(this.createError(404));
      }.bind(this)
    );
  }

  /**
   * Begins listening for requests on this.port
   *
   * @param {number} port Port to listen for http and websocket requests
   * @return void
   */
  launchServer(port) {
    this.server = this.app.listen(port);
    console.log(`Serving on http://127.0.0.1:${port}`);
    return this.server;
  }
}

module.exports = Server;
