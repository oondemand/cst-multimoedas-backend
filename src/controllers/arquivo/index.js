const {
  helpers: { sendResponse },
} = require("central-oon-core-backend");
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
