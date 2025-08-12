const Moeda = require("../../models/Moeda");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const CotacaoService = require("./bacen");

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
  const moedas = await Moeda.find({ status: "ativo" });
  return moedas;
};

const atualizarCotacao = async () => {
  const moedas = await Moeda.find({ status: "ativo" });
  const dezMinutos = 10 * 60 * 1000;

  await Promise.all(
    moedas.map(async (moeda) => {
      try {
        if (moeda.sigla === "BRL") return;

        const agora = Date.now();
        const atualizadoEm = new Date(moeda.updatedAt).getTime();
        const diferenca = agora - atualizadoEm;

        if (diferenca < dezMinutos) return;

        const cotacao = await CotacaoService.consultar({
          sigla: moeda.sigla,
        });

        if (cotacao) {
          await Moeda.findByIdAndUpdate(moeda._id, {
            cotacao,
          });
        }
      } catch (error) {
        console.log("ERROR", error);
      }
    })
  );
};

module.exports = {
  listarComPaginacao,
  atualizarCotacao,
  listarAtivas,
};
