const { createApp } = require("./app");
const { startServer } = require("./server");
const middlewares = require("./middlewares");
const config = require("./config");
const utils = require("./utils");
const modelsModule = require("./models");

module.exports = {
  createApp,
  startServer,
  middlewares,
  config,
  utils,
  ...modelsModule,
};
