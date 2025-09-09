const dotenv = require('dotenv');
dotenv.config();

const createApp = require('./boot/createApp');
const createServer = require('./boot/createServer');
const logger = require('./config/logger');
const { uploadExcel, uploadPDF } = require('./config/multer');
const createHttpClient = require('./config/httpClient');
const GenericError = require('./errors/GenericError');
const errorMiddleware = require('./middlewares/errorMiddleware');
const logMiddleware = require('./middlewares/logMiddleware');
const Log = require('./models/Log');
const { sendErrorResponse } = require('./utils/response');

module.exports = {
  createApp,
  createServer,
  logger,
  uploadExcel,
  uploadPDF,
  createHttpClient,
  GenericError,
  errorMiddleware,
  logMiddleware,
  Log,
  sendErrorResponse,
};
