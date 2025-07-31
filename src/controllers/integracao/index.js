const IntegracaoService = require("../../services/integracao");
const Helpers = require("../../utils/helpers");
const PessoaQueue = require("../../services/pessoa/omie");

const listar = async (req, res) => {
  const results = await IntegracaoService.listarTodos({
    tipo: req.query.tipo,
    direcao: req.query.direcao,
    time: req.query.time,
  });

  Helpers.sendResponse({
    res,
    statusCode: 200,
    results,
  });
};

const processar = async (req, res) => {
  PessoaQueue.queue.centralOmie.start();

  Helpers.sendResponse({
    res,
    statusCode: 200,
  });
};

module.exports = {
  listar,
  processar,
};
