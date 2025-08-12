const mapImporter = async ({ row }) => {
  const documentoFiscal = {
    pessoa: {
      nome: row[0],
      documento: row[1],
      tipo: row[2]?.toLowerCase(),
    },
    tipoDocumentoFiscal: row[3],
    numero: row[4],
    valor: row[5],
    imposto: row[6],
    classificacaoFiscal: row[7],
    descricao: row[8],
    observacao: row[9],
    motivoRecusa: row[10],
    statusValidacao: row[11],
  };

  return documentoFiscal;
};

module.exports = { mapImporter };
