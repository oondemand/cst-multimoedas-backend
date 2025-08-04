const mapExporter = ({ pessoa }) => {
  try {
    const cliente = {
      // tags: ["Fornecedor"],
      cnpj_cpf: pessoa?.documento,
      razao_social: pessoa?.nome?.substring(0, 60),
      nome_fantasia:
        pessoa?.pessoaJuridica?.nomeFantasia ?? pessoa?.nome?.substring(0, 60),
      codigo_pais: pessoa?.endereco?.pais?.cod,
      endereco_numero: pessoa?.endereco?.numero,
      email: pessoa?.email,
      caracteristicas: [
        { campo: "grupo", conteudo: pessoa?.pessoaFisica?.grupo },
        { campo: "rg", conteudo: pessoa?.pessoaFisica?.rg },
        { campo: "apelido", conteudo: pessoa?.pessoaFisica?.apelido },
        {
          campo: "dataNascimento",
          conteudo: pessoa?.pessoaFisica?.dataNascimento,
        },

        {
          campo: "regimeTributario",
          conteudo: pessoa?.pessoaJuridica?.regimeTributario,
        },
      ].filter(
        (item) =>
          item.conteudo !== undefined &&
          item.conteudo !== null &&
          item.conteudo !== ""
      ),
    };

    if (pessoa?.tipo === "ext") {
      cliente.estado = "EX";
      cliente.cidade = "EX";
      cliente.exterior = "S";
      cliente.nif = pessoa?.documento;
    }

    return cliente;
  } catch (error) {
    throw new Error("Erro ao formatar cliente/fornecedor: " + error);
  }
};

module.exports = {
  mapExporter,
};
