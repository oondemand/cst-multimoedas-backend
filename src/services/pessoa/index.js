const PessoaBusiness = require("./business");
const Pessoa = require("../../models/Pessoa");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const PessoaNaoEncontradaError = require("../errors/pessoa/pessoaNaoEncontradaError");
const { LISTA_PAISES_OMIE } = require("../../constants/omie/paises");

const criar = async ({ pessoa }) => {
  return await PessoaBusiness.criar({ pessoa });
};

const atualizar = async ({ id, pessoa }) => {
  const pessoaAtualizada = await Pessoa.findByIdAndUpdate(id, pessoa, {
    new: true,
  });

  await pessoaAtualizada.save();
  if (!pessoaAtualizada) return new PessoaNaoEncontradaError();
  return pessoaAtualizada;
};

const buscarPorId = async ({ id }) => {
  const pessoa = await Pessoa.findById(id);
  if (!pessoa || !id) throw new PessoaNaoEncontradaError();
  return pessoa;
};

const excluir = async ({ id }) => {
  return await PessoaBusiness.excluir({ id });
};

const buscarPorDocumento = async ({ documento }) => {
  const pessoa = await Pessoa.findOne({ documento });
  if (!pessoa || !documento) throw new PessoaNaoEncontradaError();
  return pessoa;
};

const listarComPaginacao = async ({
  pageIndex,
  pageSize,
  searchTerm,
  filtros,
  ...rest
}) => {
  const camposBusca = ["status", "nome", "email", "tipo"];

  const query = FiltersUtils.buildQuery({
    filtros,
    schema: Pessoa.schema,
    searchTerm,
    camposBusca,
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [pessoas, totalDePessoas] = await Promise.all([
    Pessoa.find({
      $and: [...query, { status: { $ne: "arquivado" } }],
    })
      .skip(skip)
      .limit(limite),
    Pessoa.countDocuments({
      $and: [...query, { status: { $ne: "arquivado" } }],
    }),
  ]);

  return { pessoas, totalDePessoas, page, limite };
};

const buscarIdsPessoasFiltrados = async ({
  filtros,
  searchTerm,
  camposBusca,
}) => {
  if (!filtros && !searchTerm) return [];

  const pessoasQuery = FiltersUtils.buildQuery({
    filtros,
    schema: Pessoa.schema,
    searchTerm,
    camposBusca,
  });

  const pessoasIds = await Pessoa.find({
    $and: pessoasQuery,
  }).select("_id");

  return pessoasIds.length > 0 ? pessoasIds.map((e) => e._id) : [];
};

module.exports = {
  criar,
  buscarPorId,
  atualizar,
  excluir,
  listarComPaginacao,
  buscarPorDocumento,
  buscarIdsPessoasFiltrados,
};
