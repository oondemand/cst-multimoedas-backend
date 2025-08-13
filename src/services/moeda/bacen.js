const axios = require("axios");

const consultar = async ({ sigla }) => {
  let dataCotacao = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${sigla}'&@dataCotacao='${dataCotacao}'&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim`;

  const response = await axios.get(url, { timeout: 5000 });

  const cotacao = response.data.value.find(
    (cotacao) => cotacao.tipoBoletim === "Fechamento PTAX"
  )?.cotacaoCompra;

  return { cotacao, response: response.data, url };
};

module.exports = {
  consultar,
};
