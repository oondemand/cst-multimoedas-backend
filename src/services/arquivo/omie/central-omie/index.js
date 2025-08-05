const Integracao = require("../../../../models/Integracao");
const IntegracaoService = require("../../../integracao/");
const Queue = require("../../../queue/index.js");
const { handler } = require("./handler.js");

const queue = Queue({
  handler,
  next: () =>
    IntegracaoService.buscarTaskAtiva({
      direcao: "central_omie",
      tipo: "anexos",
    }),
});

const addTask = async ({ arquivo, contaPagar }) => {
  await Integracao.updateMany(
    { parentId: contaPagar._id, etapa: { $nin: ["sucesso", "processando"] } },
    { arquivado: true, motivoArquivamento: "Duplicidade" }
  );

  await Integracao.create({
    titulo: `Central -> Omie: ${arquivo?.nomeOriginal}`,
    tipo: "anexos",
    direcao: "central_omie",
    parentId: contaPagar._id,
    payload: arquivo,
    etapa: "requisicao",
  });
};

module.exports = {
  addTask,
  queue,
};
