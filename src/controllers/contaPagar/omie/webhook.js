const Helpers = require("../../../utils/helpers");
const BaseOmie = require("../../../models/BaseOmie");
const ContaPagarSync = require("../../../services/contaPagar/omie");

const SyncContaPagar = async (req, res) => {
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
    [
      "Financas.ContaPagar.Alterado",
      "Financas.ContaPagar.BaixaRealizada",
      "Financas.ContaPagar.BaixaCancelada",
      "Financas.ContaPagar.Excluido",
    ].includes(topic)
  ) {
    ContaPagarSync.omieCentral.addTask({
      contaPagarOmie: event,
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
  SyncContaPagar,
};
