const dotenv = require('dotenv');
dotenv.config();

const createApp = require('./boot/createApp');
const createServer = require('./boot/createServer');
const logger = require('./config/logger');
const { uploadExcel, uploadPDF } = require('./config/multer');
const createHttpClient = require('./config/httpClient');

module.exports = {
  createApp,
  createServer,
  logger,
  uploadExcel,
  uploadPDF,
  createHttpClient,
};
