const axios = require("axios");

const validarMoedaExistente = async ({ moeda }) => {
  if (moeda === "") return true;

  try {
    const response = await axios.get(
      "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$format=json"
    );

    const moedasBacen = response.data.value.map((m) => m.simbolo.toUpperCase());
    const moedasValidas = [...moedasBacen, "BRL"];

    return moedasValidas.some((m) => m === moeda?.trim()?.toUpperCase());
  } catch (error) {
    console.log("[ERRO AO VALIDAR MOEDA]");
    return false;
  }
};

module.exports = {
  validarMoedaExistente,
};
