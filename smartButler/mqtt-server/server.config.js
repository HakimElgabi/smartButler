const path = require("path");
const registry = require("../registry.json");

module.exports = {
  port: 4040,
  view: {
    engine: "ejs",
    folder: path.join(__dirname, "views"),
    static: path.join(__dirname, "views", "public"),
  },
  registry: registry,
};
