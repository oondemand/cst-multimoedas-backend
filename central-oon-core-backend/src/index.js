const dotenv = require('dotenv');
dotenv.config();

const {
  login,
  validateToken,
  recoverPassword,
  changePassword,
  authMiddleware,
} = require('./auth');

module.exports = {
  login,
  validateToken,
  recoverPassword,
  changePassword,
  authMiddleware,
};
