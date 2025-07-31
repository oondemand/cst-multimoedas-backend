const Integracao = require("../../../models/Integracao");
const IntegracaoService = require("../../integracao/");
const Queue = require("../../queue/index.js");

const handler = (integracao) => {
  console.log(integracao);
};

const centralOmie = Queue({
  handler,
  next: () =>
    IntegracaoService.buscarTaskAtiva({
      direcao: "central_omie",
      tipo: "pessoa",
    }),
});

const omie = async ({ pessoa }) => {
  await Integracao.updateMany(
    { parentId: pessoa._id },
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
  omie,
  queue: {
    centralOmie,
  },
};
