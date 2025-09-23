const mongoose = require("mongoose");

const createSistemaModel = () => {
  if (mongoose.models.Sistema) {
    return mongoose.models.Sistema;
  }

  const omieSchema = new mongoose.Schema(
    {
      id_conta_corrente: { type: Number },
      codigo_categoria: { type: String },
    },
    { _id: false },
  );

  const sistemaSchema = new mongoose.Schema(
    {
      omie: omieSchema,
      openIaKey: String,
      appKey: String,
      sendgrid_api_key: { type: String },
      remetente: { type: { nome: String, email: String } },
      data_corte_app_publisher: { type: Date },
    },
    { timestamps: true },
  );

  return mongoose.model("Sistema", sistemaSchema);
};

module.exports = createSistemaModel;
