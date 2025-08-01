const Integracao = require("../../../../models/Integracao");
const IntegracaoService = require("../../../integracao/");
const Queue = require("../../../queue/index.js");
const { handler } = require("./handler.js");

const queue = Queue({
  handler,
  next: () =>
    IntegracaoService.buscarTaskAtiva({
      direcao: "central_omie",
      tipo: "pessoa",
    }),
});

const addTask = async ({ pessoa }) => {
  await Integracao.updateMany(
    { parentId: pessoa._id, etapa: { $nin: ["sucesso", "processando"] } },
    { arquivado: true, motivoArquivamento: "Duplicidade" }
  );

  await Integracao.create({
    titulo: `Central -> Omie: ${pessoa?.nome}`,
    tipo: "pessoa",
    direcao: "central_omie",
    parentId: pessoa._id,
    payload: pessoa,
    etapa: "requisicao",
  });
};

module.exports = {
  addTask,
  queue,
};
