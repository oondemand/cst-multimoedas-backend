const Servico = require("../../models/Servico");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const PessoaService = require("../pessoa");
const MoedaService = require("../moeda/bacen");

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
      .populate("pessoa moeda"),

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

  return {
    servicos,
    totalDeServicos,
    page,
    limite,
  };
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
    // 1. Join com a coleção de moedas
    {
      $lookup: {
        from: "moedas", // nome da collection no MongoDB (sempre no plural por padrão)
        localField: "moeda",
        foreignField: "_id",
        as: "moedaInfo",
      },
    },

    // 2. Desestrutura o array moedaInfo (porque $lookup retorna array)
    {
      $unwind: {
        path: "$moedaInfo",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 3. Calcula o valor real (valorMoeda * moeda.cotacao)
    {
      $addFields: {
        valorCalculado: {
          $multiply: [
            { $ifNull: ["$valorMoeda", 0] },
            { $ifNull: ["$moedaInfo.cotacao", 1] },
          ],
        },
      },
    },

    // 4. Agrupa por status
    {
      $group: {
        _id: "$status",
        total: { $sum: "$valorCalculado" },
        count: { $sum: 1 },
      },
    },

    // 5. Projeta resultado final
    {
      $project: {
        _id: 0,
        status: "$_id",
        total: 1,
        count: 1,
      },
    },
  ];

  return await Servico.aggregate(aggregationPipeline);
};

const adicionarCotacao = async ({ servicos }) => {
  return servicos.map((servico) => {
    return {
      ...servico.toObject(),
      valor:
        servico.valorMoeda *
        (servico.cotacao ? servico.cotacao : servico?.moeda?.cotacao ?? 1),
    };
  });
};

const fixarCotacao = async ({ servicos }) => {
  return await Promise.all(
    servicos.map(async (servico) => {
      servico.cotacao = servico?.moeda?.cotacao;
      await servico.save();

      return {
        ...servico.toObject(),
        valor: servico.valorMoeda * servico.cotacao,
      };
    })
  );
};

module.exports = {
  criar,
  excluir,
  atualizar,
  buscarPorId,
  fixarCotacao,
  valoresPorStatus,
  adicionarCotacao,
  listarComPaginacao,
  listarTodosPorPessoa,
};
