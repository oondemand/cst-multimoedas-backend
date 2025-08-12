const mapImporter = async ({ row }) => {
  const getCompetencia = (props) => {
    const regex = /^\d{2}\/\d{4}$/; // Verifica se esta no formato MM/YYYY

    if (typeof props === "string" && regex.test(props)) {
      const [mes, ano] = props.split("/");
      return { mes, ano };
    }
  };

  const documentoFiscal = {
    pessoa: {
      nome: row[0],
      documento: row[1],
      tipo: row[2]?.toLowerCase(),
    },
    tipoDocumentoFiscal: row[3],
    numero: row[4],
    competencia: getCompetencia(row[5]),
    valor: row[6],
    imposto: row[7],
    classificacaoFiscal: row[8],
    descricao: row[9],
    observacao: row[10],
    motivoRecusa: row[11],
    statusValidacao: row[12],
  };

  return documentoFiscal;
};

module.exports = { mapImporter };
