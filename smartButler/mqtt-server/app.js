const Server = require("./core/server");
const server = new Server();

server.init();
module.exports = server.launchServer(server.config.port);
