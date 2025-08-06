const axios = require("axios");
const GenericError = require("../errors/generic");

const cache = new Map(); // { USD: { valor: 5.37, timestamp: 123456789 } }
const duration = 30 * 60 * 1000; // 30 minutos em milissegundos

const consultar = async ({ sigla }) => {
  const agora = Date.now();
  const cacheItem = cache.get(sigla);

  const cacheValido = cacheItem && agora - cacheItem.timestamp < duration;
  if (cacheValido) return cacheItem.valor;

  try {
    let dataCotacao = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    const response = await axios.get(
      `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${sigla}'&@dataCotacao='${dataCotacao}'&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim`,
      { timeout: 5000 }
    );

    const cotacao = response.data.value.find(
      (cotacao) => cotacao.tipoBoletim === "Fechamento PTAX"
    )?.cotacaoCompra;

    cache.set(sigla, { valor: cotacao, timestamp: agora });

    return cotacao;
  } catch (error) {
    console.log(`⚠️ Erro ao consultar cotação ${sigla}:`, error.message);

    if (cacheItem) return cacheItem.valor;

    throw new GenericError(
      `Não foi possível obter a cotação da moeda ${sigla} e não há cache disponível.`
    );
  }
};

module.exports = {
  cotacao: {
    consultar,
  },
};
