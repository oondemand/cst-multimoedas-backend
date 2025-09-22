const Importacao = require("../../models/Importacao");
const PaginationUtils = require("../../../packages/central-oon-core-backend/src/utils/pagination");
const GenericError = require("../errors/generic");

const criar = async ({ tipo, arquivo }) => {
  const importacao = new Importacao({
    tipo,
    arquivoOriginal: { ...arquivo, nome: arquivo.originalname },
  });

  if (!importacao) throw new GenericError("Erro ao criar importação", 400);

  await importacao.save();
  return importacao;
};

const listar = async ({
  pageIndex,
  pageSize,
  searchTerm,
  filtros,
  ...rest
}) => {
  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [importacoes, totalImportacoes] = await Promise.all([
    Importacao.find(filtros).sort({ createdAt: -1 }).skip(skip).limit(limite),
    Importacao.countDocuments(filtros),
  ]);

  return { importacoes, totalImportacoes, page, limite };
};

module.exports = { listar, criar };
