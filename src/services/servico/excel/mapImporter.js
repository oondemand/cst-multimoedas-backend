const { Moeda } = require("central-oon-core-backend");

const mapImporter = async ({ row }) => {
  let moeda = await Moeda.findOne({
    sigla: "BRL",
  });

  if (row[4] !== "") {
    const moedaPlanilha = await Moeda.findOne({
      sigla: row[4]?.toUpperCase(),
    });

    if (moedaPlanilha) {
      moeda = moedaPlanilha;
    }
  }

  const servico = {
    pessoa: {
      nome: row[0],
      tipo: row[1],
      documento: row[2],
    },
    tipoServicoTomado: row[3],
    moeda,
    valorMoeda: row[5],
    // valor: moeda.cotacao * Number(row[6]) ?? 0,
    descricao: row[7],
    dataContratacao: row[8],
    dataConclusao: row[9],
  };

  return servico;
};

module.exports = { mapImporter };
