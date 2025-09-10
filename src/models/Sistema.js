const mongoose = require("mongoose");

const sistemaSchema = new mongoose.Schema(
  {
    openIaKey: String,
    appKey: String,
    sendgrid_api_key: { type: String },
    remetente: { type: { nome: String, email: String } },
  },
  { timestamps: true }
);

const Sistema = mongoose.model("Sistema", sistemaSchema);

module.exports = Sistema;
