const Servico = require("../../models/Servico");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const PessoaService = require("../pessoa");
const MoedaService = require("../moeda");

const criar = async ({ servico }) => {
  const novoServico = new Servico(servico);
  await novoServico.save();
  return novoServico;
};

const atualizar = async ({ id, servico }) => {
  const servicoAtualizada = await Servico.findByIdAndUpdate(id, servico, {
    new: true,
  });
  if (!servicoAtualizada) return new ServicoNaoEncontradaError();
  return servicoAtualizada;
};

const buscarPorId = async ({ id }) => {
  const servico = await Servico.findById(id);
  if (!servico || !id) throw new ServicoNaoEncontradaError();
  return servico;
};

const excluir = async ({ id }) => {
  const servico = await Servico.findById(id);
  servico.status = "arquivado";
  return await servico.save();
};

const listarComPaginacao = async ({
  filtros,
  searchTerm,
  pageIndex,
  pageSize,
}) => {
  const camposBusca = [
    "tipoServicoTomado",
    "descricao",
    "valor",
    "dataContratacao",
    "dataConclusao",
    "status",
  ];

  const [filters, or] = FiltersUtils.buildQuery({
    filtros,
    schema: Servico.schema,
    searchTerm,
    camposBusca,
  });

  const pessoaQuery = await PessoaService.buscarIdsPessoasFiltrados({
    filtros: {},
    searchTerm,
    camposBusca: ["nome", "documento"],
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [servicos, totalDeServicos] = await Promise.all([
    Servico.find({
      $and: [
        filters,
        {
          $or: [
            ...or["$or"],
            { pessoa: { $in: pessoaQuery.map((e) => e._id) } },
          ],
        },
        { status: { $ne: "arquivado" } },
      ],
    })
      .skip(skip)
      .limit(limite)
      .populate("pessoa"),
    Servico.countDocuments({
      $and: [
        filters,
        {
          $or: [
            ...or["$or"],
            { pessoa: { $in: pessoaQuery.map((e) => e._id) } },
          ],
        },
        { status: { $ne: "arquivado" } },
      ],
    }),
  ]);

  return { servicos, totalDeServicos, page, limite };
};

const listarTodosPorPessoa = async ({ pessoaId }) => {
  const servicos = await Servico.find({
    statusProcessamento: "aberto",
    pessoa: pessoaId,
  }).populate("pessoa", "nome documento");

  return servicos;
};

const valoresPorStatus = async () => {
  const aggregationPipeline = [
    {
      $group: {
        _id: { status: "$status", moeda: "$moeda", cotacao: "$cotacao" },
        totalMoeda: { $sum: "$valorMoeda" },
        count: { $sum: 1 },
      },
    },
  ];

  const parciais = await Servico.aggregate(aggregationPipeline);

  const resultadosPorStatus = {};

  for (const item of parciais) {
    let { status, moeda, cotacao } = item._id;
    const totalMoeda = item.totalMoeda;
    const count = item.count;

    if (!cotacao && moeda !== "BRL") {
      cotacao = (await MoedaService.cotacao.consultar({ sigla: moeda })) || 1;
    }

    if (!cotacao && moeda === "BRL") {
      cotacao = 1;
    }

    const totalConvertido = Number((totalMoeda * cotacao).toFixed(2));

    if (!resultadosPorStatus[status]) {
      resultadosPorStatus[status] = { total: 0, count: 0 };
    }

    resultadosPorStatus[status].total += totalConvertido;
    resultadosPorStatus[status].count += count;
  }

  const resultadoFinal = Object.entries(resultadosPorStatus).map(
    ([status, { total, count }]) => ({ status, total, count })
  );

  return resultadoFinal;
};

const adicionarCotacao = async ({ servicos }) => {
  return await Promise.all(
    servicos.map(async (item) => {
      const servico = item.toObject();

      if (servico.cotacao)
        return {
          ...servico,
          valor: servico.cotacao * servico?.valorMoeda ?? 0,
        };

      if (servico.moeda === "BRL")
        return { ...servico, valor: servico.valorMoeda };

      const cotacao = await MoedaService.cotacao.consultar({
        sigla: servico.moeda,
      });

      if (cotacao)
        return {
          ...servico,
          valor: Number((cotacao * servico?.valorMoeda ?? 0).toFixed(2)),
        };

      return servico;
    })
  );
};

module.exports = {
  criar,
  excluir,
  atualizar,
  buscarPorId,
  valoresPorStatus,
  adicionarCotacao,
  listarComPaginacao,
  listarTodosPorPessoa,
};
