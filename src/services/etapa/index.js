const Etapa = require("../../models/Etapa");
const EtapaNaoEncontradaError = require("../errors/etapa/etapaNaoEncontradaError");
const {
  filters: FiltersUtils,
  pagination: PaginationUtils,
} = require("central-oon-core-backend");

const criar = async ({ etapa }) => {
  const etapaNova = new Etapa(etapa);
  await etapaNova.save();
  return etapaNova;
};

const listarEtapasAtivasPorEsteira = async ({ esteira }) => {
  return await Etapa.find({ status: "ativo", esteira }).sort({ posicao: 1 });
};

const atualizar = async ({ id, etapa }) => {
  const etapaAtualizada = await Etapa.findByIdAndUpdate(id, etapa, {
    new: true,
  });
  if (!etapaAtualizada) return new EtapaNaoEncontradaError();
  return etapaAtualizada;
};

const buscarPorId = async ({ id }) => {
  const etapa = await Etapa.findById(id);
  if (!etapa || !id) throw new EtapaNaoEncontradaError();
  return etapa;
};

const excluir = async ({ id }) => {
  const etapa = await Etapa.findByIdAndDelete(id);
  if (!etapa || !id) throw new EtapaNaoEncontradaError();
  return etapa;
};

const listarComPaginacao = async ({
  filtros,
  pageIndex,
  pageSize,
  searchTerm,
  ...rest
}) => {
  const query = FiltersUtils.buildQuery({
    filtros,
    schema: Etapa.schema,
    searchTerm,
    camposBusca: ["codigo", "nome", "posicao", "status"],
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [etapas, totalDeEtapas] = await Promise.all([
    Etapa.find({ $and: query }).skip(skip).limit(limite),
    Etapa.countDocuments({ $and: query }),
  ]);

  return { page, limite, etapas, totalDeEtapas };
};

module.exports = {
  criar,
  listarEtapasAtivasPorEsteira,
  atualizar,
  buscarPorId,
  excluir,
  listarComPaginacao,
};
