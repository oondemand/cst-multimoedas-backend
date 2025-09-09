
const dotenv = require('dotenv');
dotenv.config();

const createApp = require('./boot/createApp');
const createServer = require('./boot/createServer');
const logger = require('./config/logger');

module.exports = {
  createApp,
  createServer,
  logger,
};
