const mapExporter = () => {
  const documentoFiscal = {
    Nome: "pessoa.nome",
    Documento: "pessoa.documento",
    "Tipo de cliente/prestador": "pessoa.tipo",
    "Tipo de documento fiscal": "tipoDocumentoFiscal",
    Numero: "numero",
    Valor: "valor",
    Imposto: "imposto",
    "Classificacao fiscal": "classificacaoFiscal",
    Descrição: "descricao",
    Observação: "observacao",
    "Motivo da recusa": "motivoRecusa",
    "Status da validação": "statusValidacao",
  };

  return documentoFiscal;
};

module.exports = { mapExporter };
