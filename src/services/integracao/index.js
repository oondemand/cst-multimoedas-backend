const Integracao = require("../../models/Integracao");
const FiltersUtils = require("../../../central-oon-core-backend/utils/pagination/filter");
const PaginationUtils = require("../../../central-oon-core-backend/utils/pagination");
const IntegracaoNaoEncontradoError = require("../errors/integracao/integracaoNaoEncontrado");
const ServicoTomadoTicket = require("../../models/ServicoTomadoTicket");
const ContaPagar = require("../../models/ContaPagar");

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

const arquivar = async ({ id, integracao }) => {
  const integracaoAtualizada = await Integracao.findByIdAndUpdate(id, {
    arquivado: true,
    motivoArquivamento: "Solicitado pelo usuário",
  });

  if (!integracaoAtualizada) throw new IntegracaoNaoEncontradoError();

  const { tipo, direcao, parentId } = integracaoAtualizada;

  if (tipo === "conta_pagar" && direcao === "central_omie") {
    await ServicoTomadoTicket.findOneAndUpdate(
      { contaPagarOmie: parentId },
      { etapa: "aprovacao-fiscal", $unset: { contaPagarOmie: "" } }
    );
  }

  if (tipo === "anexos" && direcao === "central_omie") {
    const isAnexoPendente = await Integracao.findOne({
      parentId,
      tipo: "anexos",
      direcao: "central_omie",
      arquivado: false,
      etapa: { $nin: ["sucesso"] },
    });

    if (!isAnexoPendente) {
      await Integracao.findOneAndUpdate(
        {
          parentId,
          tipo: "conta_pagar",
          direcao: "central_omie",
          arquivado: false,
          etapa: "anexos",
        },
        {
          etapa: "sucesso",
        }
      );
    }
  }

  return integracaoAtualizada;
};

const reprocessar = async ({ id, integracao }) => {
  const integracaoAtualizada = await Integracao.findByIdAndUpdate(id, {
    etapa: "reprocessar",
  });

  if (!integracaoAtualizada) throw new IntegracaoNaoEncontradoError();
  return integracaoAtualizada;
};

const listarComPaginacao = async ({
  pageIndex,
  pageSize,
  searchTerm,
  filtros,
  direcao,
  tipo,
  ...rest
}) => {
  const camposBusca = ["titulo", "status", "motivoArquivamento"];

  const query = FiltersUtils.buildQuery({
    filtros,
    schema: Integracao.schema,
    searchTerm,
    camposBusca,
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [integracoes, totalDeIntegracoes] = await Promise.all([
    Integracao.find({
      $and: [...query, { direcao: direcao, tipo: tipo }],
    })
      .skip(skip)
      .limit(limite),
    Integracao.countDocuments({
      $and: [...query, { direcao: direcao, tipo: tipo }],
    }),
  ]);

  return { integracoes, totalDeIntegracoes, page, limite };
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

const listarIntegracoesAgrupadasPorDirecaoTipo = async () => {
  const result = await Integracao.aggregate([
    { $match: { arquivado: false } },
    {
      $group: {
        _id: { tipo: "$tipo", direcao: "$direcao", etapa: "$etapa" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { tipo: "$_id.tipo", direcao: "$_id.direcao" },
        etapas: { $push: { etapa: "$_id.etapa", count: "$count" } },
      },
    },
    {
      $project: {
        _id: 0,
        tipo: "$_id.tipo",
        direcao: "$_id.direcao",
        etapas: 1,
      },
    },
  ]);

  return result;
};

module.exports = {
  arquivar,
  reprocessar,
  listarTodos,
  buscarTaskAtiva,
  listarComPaginacao,
  listarIntegracoesAgrupadasPorDirecaoTipo,
};
