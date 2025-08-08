const mapExporter = () => {
  const pessoa = {
    Grupo: "grupo",
    Nome: "nome",
    Email: "email",
    Tipo: "tipo",
    Pais: "endereco.pais.nome",
    Documento: "documento",
    Rg: "pessoaFisica.rg",
    "Data de nascimento": "pessoaFisica.dataNascimento",
    Apelido: "pessoaFisica.apelido",
    "Nome da fantasia": "pessoaJuridica.nomeFantasia",
    "Regime tributário": "pessoaJuridica.regimeTributario",
  };

  return pessoa;
};

module.exports = { mapExporter };
