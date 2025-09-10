const { Integracao, IntegracaoService } = require("central-oon-core-backend");
const Queue = require("../../../queue/index.js");
const { handler } = require("./handler.js");

const queue = Queue({
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
