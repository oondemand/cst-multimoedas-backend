const mongoose = require('mongoose');

const SistemaSchema = new mongoose.Schema(
  {
    openIaKey: String,
    appKey: String,
    sendgrid_api_key: { type: String },
    remetente: { type: { nome: String, email: String } },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sistema', SistemaSchema);
