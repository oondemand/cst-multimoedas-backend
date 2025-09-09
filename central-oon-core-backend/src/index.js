
const dotenv = require('dotenv');
dotenv.config();

const createApp = require('./boot/createApp');
const createServer = require('./boot/createServer');
const logger = require('./config/logger');
const createHttpClient = require('./config/httpClient');
const { uploadExcel, uploadPDF } = require('./config/multer');

module.exports = {
  createApp,
  createServer,
  logger,
  createHttpClient,
  uploadExcel,
  uploadPDF,
};
