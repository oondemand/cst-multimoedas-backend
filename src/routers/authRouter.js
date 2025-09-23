const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuario");
const {
  middlewares: { authMiddleware },
} = require("../../central-oon-core-backend");
const { asyncHandler } = require("../../central-oon-core-backend/utils/helpers");

router.post("/login", asyncHandler(UsuarioController.loginUsuario));
router.get(
  "/validar-token",
  authMiddleware,
  asyncHandler(UsuarioController.validarToken)
);

router.post(
  "/esqueci-minha-senha",
  asyncHandler(UsuarioController.esqueciMinhaSenha)
);

router.post("/alterar-senha", asyncHandler(UsuarioController.alterarSenha));
module.exports = router;
