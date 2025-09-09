
const dotenv = require('dotenv');
dotenv.config();

const createApp = require('./boot/createApp');
const createServer = require('./boot/createServer');

module.exports = {
  createApp,
  createServer,
};
