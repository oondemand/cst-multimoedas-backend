const buildSortingQuery = ({ sortBy }) => {
  let sorting = {};

  if (sortBy) {
    const [campo, direcao] = sortBy.split(".");
    const campoFormatado = campo.replaceAll("_", ".");
    sorting[campoFormatado] = direcao === "desc" ? -1 : 1;
  }

  return { sorting };
};

const buildPaginationQuery = ({ pageIndex, pageSize }) => {
  const page = parseInt(pageIndex) || 0;
  const limite = parseInt(pageSize) || 10;
  const skip = page * limite;

  return { page, limite, skip };
};

module.exports = {
  buildPaginationQuery,
  buildSortingQuery,
};
