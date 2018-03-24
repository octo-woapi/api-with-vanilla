const http = require("http");

module.exports = async () => {
  const server = http.createServer();

  const conf = require("./conf")();
  const database = require("./src/database")(conf);
  const models = require("./src/models")(database);

  await database.sync({});

  const schemas = require("./src/schemas")();
  const services = require("./src/services")(schemas, models);
  const router = require("./src/routers")(services);

  server.on("request", router);

  return server;
};
