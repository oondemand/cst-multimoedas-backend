const mongoose = require("mongoose");

const createImportacaoModel = () => {
  if (mongoose.models.Importacao) {
    return mongoose.models.Importacao;
  }

  const ArquivoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    buffer: { type: Buffer },
  });

  const ImportacaoSchema = new mongoose.Schema(
    {
      tipo: {
        type: String,
        enum: ["pessoa", "servico", "documento-cadastral", "documento-fiscal"],
      },
      arquivoOriginal: ArquivoSchema,
      arquivoErro: { type: Buffer },
      arquivoLog: { type: Buffer },
      detalhes: { type: Object },
    },
    { timestamps: true },
  );

  return mongoose.model("Importacao", ImportacaoSchema);
};

module.exports = createImportacaoModel;
