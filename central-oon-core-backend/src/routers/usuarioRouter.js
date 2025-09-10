const express = require("express");
const path = require("path");
const router = express.Router();
const UsuarioController = require("../controllers/usuario");
const registrarAcaoMiddleware = require("../middlewares/registrarAcaoMiddleware");
const { asyncHandler } = require("../utils/helpers");
const { ACOES, ENTIDADES } = require(path.join(process.cwd(), "src", "constants", "controleAlteracao"));

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
