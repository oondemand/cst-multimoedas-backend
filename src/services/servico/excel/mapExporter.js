const mapExporter = () => {
  const servico = {
    "Cliente/Prestador": "pessoa.nome",
    Tipo: "pessoa.tipo",
    Documento: "pessoa.documento",
    "Tipo serviço tomado": "tipoServicoTomado",
    Moeda: "moeda.sigla",
    "Valor (na moeda)": "valorMoeda",
    Valor: "valor",
    Descrição: "descricao",
    "Data contratação": "dataContratacao",
    "Data conclusão": "dataConclusao",
  };

  return servico;
};

module.exports = { mapExporter };
