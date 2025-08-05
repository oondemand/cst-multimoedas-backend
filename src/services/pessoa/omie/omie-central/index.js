const Integracao = require("../../../../models/Integracao");
const IntegracaoService = require("../../../integracao/");
const Queue = require("../../../queue/index.js");
const { handler } = require("./handler.js");

const queue = Queue({
  handler,
  next: () =>
    IntegracaoService.buscarTaskAtiva({
      direcao: "omie_central",
      tipo: "pessoa",
    }),
});

const addTask = async ({ clienteOmie, requisicao }) => {
  await Integracao.updateMany(
    {
      externalId: clienteOmie.codigo_cliente_omie,
      etapa: { $nin: ["sucesso", "processando"] },
    },
    { arquivado: true, motivoArquivamento: "Duplicidade" }
  );

  await Integracao.create({
    titulo: `Central <- Omie: ${clienteOmie?.razao_social}`,
    direcao: "omie_central",
    etapa: "requisicao",
    tipo: "pessoa",
    requisicao,
    externalId: clienteOmie.codigo_cliente_omie,
  });
};

module.exports = {
  addTask,
  queue,
};
