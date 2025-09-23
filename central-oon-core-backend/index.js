const { createApp } = require("./app");
const { startServer } = require("./server");
const middlewares = require("./middlewares");
const config = require("./config");

module.exports = {
  createApp,
  startServer,
  middlewares,
  config,
};
