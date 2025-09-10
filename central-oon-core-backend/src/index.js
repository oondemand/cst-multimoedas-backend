const dotenv = require('dotenv');
dotenv.config();

const {
  login,
  validateToken,
  recoverPassword,
  changePassword,
  authMiddleware,
  authRouter,
} = require('./auth');

module.exports = {
  login,
  validateToken,
  recoverPassword,
  changePassword,
  authMiddleware,
  authRouter,
};
