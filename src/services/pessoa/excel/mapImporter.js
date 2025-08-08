const { LISTA_PAISES_OMIE } = require("../../../constants/omie/paises");

const mapImporter = async ({ row }) => {
  const pais = LISTA_PAISES_OMIE.find(
    (i) => i.cDescricao?.toLowerCase() === row[4]?.toLowerCase()
  );

  const pessoa = {
    grupo: row[0],
    nome: row[1],
    email: row[2],
    tipo: row[3],
    "endereco.pais": {
      nome: pais?.cDescricao,
      codigo: pais?.cCodigo,
      sigla: pais?.cCodigoISO,
    },
    documento: row[5],
    "pessoaFisica.rg": row[6],
    "pessoaFisica.dataNascimento": row[7],
    "pessoaFisica.apelido": row[8],
    "pessoaJuridica.nomeFantasia": row[9],
    "pessoaJuridica.regimeTributario": row[10],
  };

  return pessoa;
};

module.exports = { mapImporter };
