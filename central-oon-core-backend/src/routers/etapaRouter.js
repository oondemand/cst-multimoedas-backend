const express = require('express');
const path = require('path');
const router = express.Router();
const EtapaController = require('../controllers/etapa');
const registrarAcaoMiddleware = require('../middlewares/registrarAcaoMiddleware');
const { asyncHandler } = require('../utils/helpers');
const { ACOES, ENTIDADES } = require(path.join(process.cwd(), 'src', 'constants', 'controleAlteracao'));

router.post(
  '/',
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.CONFIGURACAO_ETAPA,
  }),
  asyncHandler(EtapaController.criarEtapa)
);
router.get('/ativas/:esteira', asyncHandler(EtapaController.listarEtapasAtivasPorEsteira));
router.get('/', asyncHandler(EtapaController.listarEtapas));
router.put(
  '/:id',
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.CONFIGURACAO_ETAPA,
  }),
  asyncHandler(EtapaController.atualizarEtapa)
);
router.delete(
  '/:id',
  registrarAcaoMiddleware({
    acao: ACOES.EXCLUIDO,
    entidade: ENTIDADES.CONFIGURACAO_ETAPA,
  }),
  asyncHandler(EtapaController.excluir)
);

module.exports = router;
