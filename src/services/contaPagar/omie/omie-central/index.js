const Integracao = require("../../../../models/Integracao");
const IntegracaoService = require("../../../integracao/");
const { QueueService } = require("central-oon-core-backend");
const { handler } = require("./handler.js");

const queue = QueueService.createQueue({
  handler,
  next: () =>
    IntegracaoService.buscarTaskAtiva({
      direcao: "omie_central",
      tipo: "conta_pagar",
    }),
});

const addTask = async ({ contaPagarOmie, requisicao }) => {
  await Integracao.updateMany(
    {
      externalId: contaPagarOmie.codigo_lancamento_omie,
      etapa: { $nin: ["sucesso", "processando"] },
    },
    { arquivado: true, motivoArquivamento: "Duplicidade" }
  );

  await Integracao.create({
    titulo: `Central <- Omie`,
    tipo: "conta_pagar",
    direcao: "omie_central",
    externalId: contaPagarOmie.codigo_lancamento_omie,
    etapa: "requisicao",
    requisicao,
  });
};

module.exports = {
  addTask,
  queue,
};
