const { LISTA_PAISES_OMIE } = require("../../../constants/omie/paises");
const { findCaracteristica } = require("../../../../packages/central-oon-core-backend/src/utils/caracteristicas");

const mapImporter = ({ cliente }) => {
  const pais = LISTA_PAISES_OMIE.find(
    (e) => e.cCodigo === cliente?.codigo_pais
  );

  const rg = findCaracteristica({
    caracteristicas: cliente?.caracteristicas,
    campo: "rg",
  });

  const apelido = findCaracteristica({
    caracteristicas: cliente?.caracteristicas,
    campo: "apelido",
  });

  const dataNascimento = findCaracteristica({
    caracteristicas: cliente?.caracteristicas,
    campo: "dataNascimento",
  });

  const regimeTributario = findCaracteristica({
    caracteristicas: cliente?.caracteristicas,
    campo: "regimeTributario",
  });

  const grupo = findCaracteristica({
    caracteristicas: cliente?.caracteristicas,
    campo: "grupo",
  });

  const tipo =
    cliente?.exterior === "S"
      ? "ext"
      : cliente?.pessoa_fisica === "S"
      ? "pf"
      : "pj";

  const pessoa = {
    email: cliente.email,
    nome: cliente.razao_social,
    tipo,
    codigo_cliente_omie: cliente.codigo_cliente_omie,
    documento: cliente.cnpj_cpf,
    grupo,
    pessoaFisica: {
      rg,
      apelido,
      dataNascimento,
    },
    pessoaJuridica: {
      nomeFantasia: cliente.nome_fantasia,
      regimeTributario,
    },
    endereco: {
      pais: {
        codigo: pais?.cCodigo,
        nome: pais?.cDescricao,
        sigla: pais?.cCodigoISO,
      },
    },
  };

  return pessoa;
};

module.exports = {
  mapImporter,
};
