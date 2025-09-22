const { createApp } = require("./app");
const { startServer } = require("./server");
const middlewares = require("./middlewares");

module.exports = {
  createApp,
  startServer,
  middlewares,
};
