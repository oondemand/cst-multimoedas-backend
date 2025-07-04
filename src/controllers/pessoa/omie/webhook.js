const { sendResponse } = require("../../../utils/helpers");
const PessoaService = require("../../../services/pessoa/omie");

const SyncPessoa = async (req, res) => {
  const { event, ping, topic, appKey } = req.body;

  if (ping === "omie") {
    return sendResponse({
      res,
      statusCode: 200,
      message: "pong",
    });
  }

  if (topic === "ClienteFornecedor.Alterado") {
    await PessoaService.importarDoOmie({
      event,
      appKey,
    });
  }

  return sendResponse({
    res,
    statusCode: 200,
    message: "Webhook recebido, cliente/prestador sendo sincronizado.",
  });
};

module.exports = {
  SyncPessoa,
};
