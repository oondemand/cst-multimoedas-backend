const connectDB = require("./config/db");
const logger = require("./config/logger");
const { uploadExcel, uploadPDF } = require("./config/multer");
const createServer = require("./server");

module.exports = {
  connectDB,
  logger,
  uploadExcel,
  uploadPDF,
  createServer,
};
