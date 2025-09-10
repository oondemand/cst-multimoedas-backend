const { Integracao, IntegracaoService } = require("central-oon-core-backend");
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
  try {
    const s = await Integracao.updateMany(
      { parentId: pessoa._id, etapa: { $nin: ["sucesso", "processando"] } },
      { arquivado: true, motivoArquivamento: "Duplicidade" }
    );

    console.log(s);
  } catch (error) {
    console.log(error);
  }

  await Integracao.create({
    titulo: `Central -> Omie: ${pessoa?.nome}`,
    tipo: "pessoa",
    direcao: "central_omie",
    parentId: pessoa._id,
    payload: pessoa?.toObject(),
    etapa: "requisicao",
  });
};

module.exports = {
  addTask,
  queue,
};
