const Integracao = require("../../../../models/Integracao");
const IntegracaoService = require("../../../integracao/");
const { QueueService } = require("central-oon-core-backend");
const { handler } = require("./handler.js");

const queue = QueueService.createQueue({
  handler,
  next: () =>
    IntegracaoService.buscarTaskAtiva({
      direcao: "central_omie",
      tipo: "conta_pagar",
    }),
});

const addTask = async ({ ticket, contaPagar }) => {
  await Integracao.updateMany(
    { parentId: contaPagar._id, etapa: { $nin: ["sucesso", "processando"] } },
    { arquivado: true, motivoArquivamento: "Duplicidade" }
  );

  await Integracao.create({
    titulo: `Central -> Omie: ${ticket?.titulo}`,
    tipo: "conta_pagar",
    direcao: "central_omie",
    parentId: contaPagar._id,
    payload: contaPagar,
    etapa: "requisicao",
  });
};

module.exports = {
  addTask,
  queue,
};
