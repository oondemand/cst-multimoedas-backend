const Helpers = require("../../../../central-oon-core-backend/utils/helpers");
const PessoaSync = require("../../../services/pessoa/omie");
const BaseOmie = require("../../../models/BaseOmie");

const SyncPessoa = async (req, res) => {
  const { event, ping, topic, appKey } = req.body;

  if (ping === "omie") {
    return Helpers.sendResponse({
      res,
      statusCode: 200,
      message: "pong",
    });
  }

  const baseOmie = BaseOmie.findOne({ appKey });

  if (!baseOmie) {
    return Helpers.sendErrorResponse({
      res,
      statusCode: 400,
      message: "Base omie não encontrada",
      error: "Base omie não encontrada",
    });
  }

  if (
    ["ClienteFornecedor.Alterado", "ClienteFornecedor.Adicionado"].includes(
      topic
    )
  ) {
    PessoaSync.omieCentral.addTask({
      clienteOmie: event,
      requisicao: {
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        body: req.body,
      },
    });
  }

  return Helpers.sendResponse({
    res,
    statusCode: 200,
    message: "Webhook recebido, cliente/prestador sendo sincronizado.",
  });
};

module.exports = {
  SyncPessoa,
};
