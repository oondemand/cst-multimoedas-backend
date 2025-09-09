const mongoose = require("mongoose");

const sistemaSchema = new mongoose.Schema(
  {
    appKey_central_oon: String,
    appKey_openIa: String,
    appKey_sendgrid: { type: String },
    templateConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
    remetente: { type: { nome: String, email: String } },
  },
  { timestamps: true },
);

const Sistema = mongoose.model("Sistema", sistemaSchema);

module.exports = Sistema;
