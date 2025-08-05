const Servico = require("../../models/Servico");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const PessoaService = require("../pessoa");

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
        _id: "$status",
        total: { $sum: { $ifNull: ["$valor", 0] } },
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, status: "$_id", total: 1, count: 1 } },
  ];

  return await Servico.aggregate(aggregationPipeline);
};

module.exports = {
  criar,
  excluir,
  atualizar,
  buscarPorId,
  valoresPorStatus,
  listarComPaginacao,
  listarTodosPorPessoa,
};
