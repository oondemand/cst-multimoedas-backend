const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  login,
  validateToken,
  recoverPassword,
  changePassword,
} = require("central-oon-core-backend");
const { asyncHandler } = require("../utils/helpers");
const Sistema = require("../models/Sistema");
const getOrigin = async () => (await Sistema.findOne())?.appKey;

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const origin = await getOrigin();
    const data = await login({ ...req.body, origin });
    res.status(200).json(data);
  })
);

router.get(
  "/validar-token",
  authMiddleware({ getOrigin }),
  asyncHandler(async (req, res) => {
    const origin = await getOrigin();
    const token = req.headers.authorization?.split(" ")[1];
    const data = await validateToken({ token, origin });
    res.status(200).json(data);
  })
);

router.post(
  "/esqueci-minha-senha",
  asyncHandler(async (req, res) => {
    const origin = await getOrigin();
    const data = await recoverPassword({ ...req.body, origin });
    res.status(200).json(data);
  })
);

router.post(
  "/alterar-senha",
  asyncHandler(async (req, res) => {
    const origin = await getOrigin();
    const token = req.headers.authorization?.split(" ")[1];
    const data = await changePassword({ ...req.body, token, origin });
    res.status(200).json(data);
  })
);

module.exports = router;
