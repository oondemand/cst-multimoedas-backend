const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuario");
const { authMiddleware } = require("central-oon-core-backend");
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");
const Sistema = require("../models/Sistema");
const getOrigin = async () => (await Sistema.findOne())?.appKey;

router.post("/login", asyncHandler(UsuarioController.loginUsuario));
router.get(
  "/validar-token",
  authMiddleware({ getOrigin }),
  asyncHandler(UsuarioController.validarToken)
);

router.post(
  "/esqueci-minha-senha",
  asyncHandler(UsuarioController.esqueciMinhaSenha)
);

router.post("/alterar-senha", asyncHandler(UsuarioController.alterarSenha));
module.exports = router;
