const mongoose = require("mongoose");

const ListaOmieSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true },
    call: { type: String },
    url: { type: String },
    select: { type: String },
    fields: { type: Object },
    data: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ListaOmie", ListaOmieSchema);
