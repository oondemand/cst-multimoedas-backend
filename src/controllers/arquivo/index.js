const { sendResponse } = require("../../../packages/central-oon-core-backend/src/utils/helpers");
const ArquivoService = require("../../services/arquivo");

const obterArquivoPorId = async (req, res) => {
  const arquivo = await ArquivoService.obterPorId({
    id: req.params.id,
  });

  sendResponse({
    res,
    statusCode: 200,
    arquivo,
  });
};

module.exports = {
  obterArquivoPorId,
};
