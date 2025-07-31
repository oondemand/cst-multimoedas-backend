const Integracao = require("../../models/Integracao");

const listarTodos = async ({ tipo, direcao, arquivado = false, time }) => {
  const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;

  const results = await Integracao.find({
    tipo,
    direcao,
    arquivado,
    updatedAt: { $gte: new Date(Date.now() - time * umDiaEmMilissegundos) },
  }).sort({ executadoEm: -1 });

  return results;
};

const buscarTaskAtiva = async ({ tipo, direcao }) => {
  const minExecutionTime = new Date(Date.now() - 1000 * 60); // 1min

  const query = {
    tipo,
    direcao,
    arquivado: false,
    $or: [
      { executadoEm: { $exists: false } },
      { executadoEm: { $lte: minExecutionTime } },
    ],
  };

  const body = {
    executadoEm: new Date(),
    etapa: "processando",
  };

  const options = {
    sort: { createdAt: 1 },
    new: true,
  };

  const integracao = await Integracao.findOneAndUpdate(
    { etapa: "requisicao", ...query },
    body,
    options
  );

  if (!integracao) {
    return await Integracao.findOneAndUpdate(
      { etapa: "reprocessar", ...query },
      body,
      options
    );
  }

  return integracao;
};

module.exports = { listarTodos, buscarTaskAtiva };
