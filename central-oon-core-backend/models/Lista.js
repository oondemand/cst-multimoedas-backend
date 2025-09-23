const mongoose = require("mongoose");
const { resolveEnumValues } = require("./utils");

const VALIDACAO = [
  {
    validator: (data) => data.length <= 500,
    message: "A lista de valores excedeu o limite de 500 elementos.",
  },
];

const createListaModel = ({ lista = {} } = {}) => {
  if (mongoose.models.Lista) {
    return mongoose.models.Lista;
  }

  const { codigos } = lista;

  const ListaSchema = new mongoose.Schema({
    codigo: { type: String, enum: resolveEnumValues(codigos), required: true, unique: true },
    data: {
      type: [{ valor: String }],
      validate: VALIDACAO,
    },
  });

  return mongoose.model("Lista", ListaSchema);
};

module.exports = createListaModel;
