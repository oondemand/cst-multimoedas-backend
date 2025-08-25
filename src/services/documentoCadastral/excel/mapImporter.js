const mapImporter = async ({ row }) => {
  const documentoCadastral = {
    pessoa: {
      nome: row[0],
      documento: row[1],
      tipo: row[2]?.toLowerCase(),
    },
    tipoDocumento: row[3],
    numero: row[4],
    descricao: row[5],
    motivoRecusa: row[6],
    observacao: row[7],
    ...(row[8] !== "" ? { statusValidacao: row[8] } : {}),
  };

  return documentoCadastral;
};

module.exports = { mapImporter };
