const SistemaService = require('../services/sistema');
const { sendResponse, sendErrorResponse } = require('../utils/helpers');

const listarSistemaConfig = async (req, res) => {
  const sistema = await SistemaService.obterConfiguracao();

  if (!sistema) {
    return sendErrorResponse({
      res,
      statusCode: 404,
      message: 'Nenhuma configuração encontrada.',
    });
  }

  sendResponse({ res, statusCode: 200, sistema });
};

const atualizarSistemaConfig = async (req, res) => {
  const sistema = await SistemaService.atualizar({ id: req.params.id, data: req.body });

  if (!sistema) {
    return sendErrorResponse({
      res,
      statusCode: 404,
      message: 'Configuração não encontrada.',
    });
  }

  sendResponse({ res, statusCode: 200, sistema });
};

const testeEmail = async (req, res) => {
  await SistemaService.testeEmail({ email: req.body.email });
  sendResponse({ res, statusCode: 200 });
};

module.exports = {
  listarSistemaConfig,
  atualizarSistemaConfig,
  testeEmail,
};
