const Assistente = require("../../models/Assistente");
const FiltersUtils = require("../../../packages/central-oon-core-backend/src/utils/pagination/filter");
const PaginationUtils = require("../../../packages/central-oon-core-backend/src/utils/pagination");
const AssistenteNaoEncontradoError = require("../errors/assistente/assistenteNaoEncontrado");

const criar = async ({ assistente }) => {
  const novoAssistente = new Assistente(assistente);
  await novoAssistente.save();
  return novoAssistente;
};

const atualizar = async ({ id, assistente }) => {
  const assistenteAtualizado = await Assistente.findByIdAndUpdate(
    id,
    assistente,
    {
      new: true,
    }
  );
  if (!assistenteAtualizado) return new AssistenteNaoEncontradoError();
  return assistenteAtualizado;
};

const excluir = async ({ id }) => {
  const assistenteExcluido = await Assistente.findByIdAndUpdate(id, {
    status: "arquivado",
  });
  if (!assistenteExcluido) return new AssistenteNaoEncontradoError();
  return assistenteExcluido;
};

const buscarAssistentePorId = async ({ id }) => {
  const assistente = await Assistente.findById(id);
  if (!assistente || !id) throw new AssistenteNaoEncontradoError();
  return assistente;
};

const listarComPaginacao = async ({
  filtros,
  pageIndex,
  pageSize,
  searchTerm,
}) => {
  const query = FiltersUtils.buildQuery({
    filtros,
    schema: Assistente.schema,
    searchTerm,
    camposBusca: ["modulo", "assistente"],
  });

  const { limite, page, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [assistentes, totalDeAssistentes] = await Promise.all([
    Assistente.find({ $and: [{ status: { $ne: "arquivado" } }, ...query] })
      .skip(skip)
      .limit(limite),
    Assistente.countDocuments({
      $and: [{ status: { $ne: "arquivado" } }, ...query],
    }),
  ]);

  return { page, limite, assistentes, totalDeAssistentes };
};

const listarTodosAssistentesAtivos = async () => {
  return await Assistente.find({ status: "ativo" });
};

module.exports = {
  criar,
  atualizar,
  excluir,
  buscarAssistentePorId,
  listarComPaginacao,
  listarTodosAssistentesAtivos,
};
