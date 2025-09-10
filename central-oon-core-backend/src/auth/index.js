const {
  login,
  validateToken,
  recoverPassword,
  changePassword,
} = require('./service');
const authMiddleware = require('../middlewares/authMiddleware');
const authRouter = require('./router');

module.exports = {
  login,
  validateToken,
  recoverPassword,
  changePassword,
  authMiddleware,
  authRouter,
};
