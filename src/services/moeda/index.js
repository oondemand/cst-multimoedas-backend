const Moeda = require("../../models/Moeda");
const {
  filters: FiltersUtils,
  pagination: PaginationUtils,
} = require("central-oon-core-backend");
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
  const dezMinutos = 1000 * 60 * 10;

  await Promise.all(
    moedas.map(async (item) => {
      try {
        if (item.sigla === "BRL") return;

        const agora = Date.now();
        const atualizadoEm = new Date(item.atualizadoEm).getTime();
        const diferenca = agora - atualizadoEm;

        if (diferenca < dezMinutos) return;

        const { cotacao, response, url } = await CotacaoService.consultar({
          sigla: item.sigla,
        });

        const moeda = await Moeda.findById(item._id);

        moeda.requisicao = { url };
        moeda.resposta = response;

        if (cotacao) {
          moeda.cotacao = cotacao;
          moeda.atualizadoEm = agora;
        }

        await moeda.save();
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
