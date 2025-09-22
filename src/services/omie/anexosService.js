const { compactFile } = require("../../../packages/central-oon-core-backend/src/utils/fileHandler");
const apiOmie = require("../../../packages/central-oon-core-backend/src/config/apiOmie");

const incluir = async (
  {
    appKey,
    appSecret,
    cTabela,
    nId,
    cNomeArquivo,
    cArquivo,
    cMd5,
    cCodIntAnexo = "",
  },
  maxTentativas = 3
) => {
  // let tentativas = 0;
  // let erroEncontrado;
  // while (tentativas < maxTentativas) {
  // try {
  // const arquivoCompactado = await compactFile(arquivo, nomeArquivo);

  const param = {
    cCodIntAnexo,
    cTabela,
    nId,
    cNomeArquivo,
    cArquivo,
    cMd5,
  };

  const body = {
    call: "IncluirAnexo",
    app_key: appKey,
    app_secret: appSecret,
    param: [param],
  };

  const response = await apiOmie.post("geral/anexo/", body);
  return response.data;
  //   } catch (error) {
  //     tentativas++;
  //     if (
  //       error.response?.data?.faultstring?.includes(
  //         "Consumo redundante detectado",
  //       )
  //     ) {
  //       await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
  //     }

  //     erroEncontrado =
  //       error.response?.data?.faultstring ||
  //       error.response?.data ||
  //       error.response ||
  //       error;
  //   }
  // }
  // throw `Erro ao incluir anexo. ${nomeArquivo} após ${maxTentativas} tentativas. ${erroEncontrado}`;
};

const anexoService = { incluir };
module.exports = anexoService;
