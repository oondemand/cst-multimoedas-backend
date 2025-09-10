const express = require('express');
const {
  login,
  validateToken,
  recoverPassword,
  changePassword,
} = require('./service');
const authMiddleware = require('../middlewares/authMiddleware');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function authRouter({ getOrigin }) {
  const router = express.Router();

  router.post(
    '/login',
    asyncHandler(async (req, res) => {
      const origin = await getOrigin();
      const data = await login({ ...req.body, origin });
      res.status(200).json(data);
    }),
  );

  router.get(
    '/validar-token',
    authMiddleware({ getOrigin }),
    asyncHandler(async (req, res) => {
      const origin = await getOrigin();
      const token = req.headers.authorization?.split(' ')[1];
      const data = await validateToken({ token, origin });
      res.status(200).json(data);
    }),
  );

  router.post(
    '/esqueci-minha-senha',
    asyncHandler(async (req, res) => {
      const origin = await getOrigin();
      const data = await recoverPassword({ ...req.body, origin });
      res.status(200).json(data);
    }),
  );

  router.post(
    '/alterar-senha',
    asyncHandler(async (req, res) => {
      const origin = await getOrigin();
      const token = req.headers.authorization?.split(' ')[1];
      const data = await changePassword({ ...req.body, token, origin });
      res.status(200).json(data);
    }),
  );

  return router;
}

module.exports = authRouter;
