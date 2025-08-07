const Moeda = require("../../models/Moeda");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");

const listarComPaginacao = async ({
  pageIndex,
  pageSize,
  searchTerm,
  filtros,
  ...rest
}) => {
  const camposBusca = ["sigla", "cotacao"];

  const query = FiltersUtils.buildQuery({
    filtros,
    schema: Moeda.schema,
    searchTerm,
    camposBusca,
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [moedas, totalDeMoedas] = await Promise.all([
    Moeda.find({
      $and: [...query, { status: { $ne: "arquivado" } }],
    })
      .skip(skip)
      .limit(limite),
    Moeda.countDocuments({
      $and: [...query, { status: { $ne: "arquivado" } }],
    }),
  ]);

  return { moedas, totalDeMoedas, page, limite };
};

const listarAtivas = async () => {
  return Moeda.find({ status: "ativo" });
};

module.exports = {
  listarComPaginacao,
  listarAtivas,
};
