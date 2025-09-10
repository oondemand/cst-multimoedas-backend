const express = require("express");
const UsuarioController = require("../controllers/usuario");
const { registrarAcaoMiddleware } = require("central-oon-core-backend");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const router = express.Router();
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");

router.get("/", asyncHandler(UsuarioController.listarUsuarios));

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.CONFIGURACAO_USUARIO,
  }),
  asyncHandler(UsuarioController.criarUsuario)
);

router.get("/:id", asyncHandler(UsuarioController.obterUsuario));

router.put(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.CONFIGURACAO_USUARIO,
  }),
  asyncHandler(UsuarioController.atualizarUsuario)
);

router.delete(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.EXCLUIDO,
    entidade: ENTIDADES.CONFIGURACAO_USUARIO,
  }),
  asyncHandler(UsuarioController.excluirUsuario)
);

router.post(
  "/esqueci-minha-senha",
  registrarAcaoMiddleware({
    acao: ACOES.CONVITE_ENVIADO,
    entidade: ENTIDADES.CONFIGURACAO_USUARIO,
  }),
  asyncHandler(UsuarioController.esqueciMinhaSenha)
);

module.exports = router;
