const authMiddleware = require("./authMiddleware");
const logMiddleware = require("./logMiddleware");
const errorMiddleware = require("./errorMiddleware");
const { registrarAcaoMiddleware } = require("./registrarAcaoMiddleware");

module.exports = {
  authMiddleware,
  logMiddleware,
  errorMiddleware,
  registrarAcaoMiddleware,
};
