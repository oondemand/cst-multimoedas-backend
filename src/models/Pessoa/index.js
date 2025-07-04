const mongoose = require("mongoose");
const pessoaFisica = require("./pessoaFisica");
const pessoaJuridica = require("./pessoaJuridica");
const { Schema } = mongoose;

const schema = new Schema(
  {
    grupo: {
      type: String,
    },
    tipo: {
      type: String,
      enum: ["pf", "pj", "ext"],
    },
    nome: {
      type: String,
      maxlength: 100,
    },
    endereco: {
      pais: {
        nome: String,
        sigla: String,
        codigo: String,
      },
    },
    documento: {
      type: String,
      maxlength: 20,
    },

    status: {
      type: String,
      enum: ["ativo", "inativo", "arquivado"],
      default: "ativo",
    },

    codigo_cliente_omie: String,
    pessoaFisica: pessoaFisica,
    pessoaJuridica: pessoaJuridica,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual("label").get(function () {
  return `${this.nome} - ${this.documento}`;
});

module.exports = mongoose.model("Pessoa", schema);
