const mongoose = require("mongoose");

const createArquivoModel = () => {
  if (mongoose.models.Arquivo) {
    return mongoose.models.Arquivo;
  }

  const ArquivoSchema = new mongoose.Schema(
    {
      nome: { type: String, required: true },
      nomeOriginal: { type: String, required: true },
      tipo: {
        type: String,
        enum: ["generico", "rpa", "documento-fiscal", "documento-cadastral"],
        default: "generico",
      },
      mimetype: { type: String, required: true },
      size: { type: Number, required: true },
      buffer: { type: Buffer },
    },
    { timestamps: true },
  );

  return mongoose.model("Arquivo", ArquivoSchema);
};

module.exports = createArquivoModel;
