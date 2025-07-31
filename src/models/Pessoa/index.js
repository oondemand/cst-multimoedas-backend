const mongoose = require("mongoose");
const pessoaFisica = require("./pessoaFisica");
const pessoaJuridica = require("./pessoaJuridica");
const { LISTA_PAISES_OMIE } = require("../../constants/omie/paises");
const { Schema } = mongoose;

const schema = new Schema(
  {
    grupo: { type: String },
    email: {
      type: String,
      lowercase: true,
      validate: {
        validator: function (v) {
          return v === null ? true : /\S+@\S+\.\S+/.test(v);
        },
        message: (props) => `${props.value} não é um e-mail válido!`,
      },

      required: false,
    },
    tipo: { type: String, enum: ["pf", "pj", "ext"] },
    nome: { type: String, maxlength: 100 },
    endereco: { pais: { nome: String, sigla: String, codigo: String } },
    documento: { type: String, maxlength: 20 },
    status: {
      type: String,
      enum: ["ativo", "inativo", "arquivado"],
      default: "ativo",
    },
    codigo_cliente_omie: String,
    pessoaFisica: pessoaFisica,
    pessoaJuridica: pessoaJuridica,
    status_sincronizacao_omie: {
      type: String,
      enum: ["sucesso", "pendente", "erro"],
      default: "pendente",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual("label").get(function () {
  return `${this.nome} - ${this.documento}`;
});

schema.pre("save", function (next) {
  if (this.tipo === "pj" || this.tipo === "ext") {
    this.pessoaFisica = {
      apelido: null,
      dataNascimento: null,
      rg: null,
    };
  }

  if (this.tipo === "pf" || this.tipo === "ext") {
    this.pessoaJuridica = {
      nomeFantasia: null,
      regimeTributario: null,
    };
  }

  if (this?.endereco?.pais?.codigo) {
    const paisOmie = LISTA_PAISES_OMIE.find(
      (e) => e?.cCodigo === this.endereco.pais.codigo
    );

    if (paisOmie) {
      this.endereco.pais = {
        nome: paisOmie.cDescricao,
        codigo: paisOmie.cCodigo,
        sigla: paisOmie.cCodigoISO,
      };
    }
  }

  next();
});

module.exports = mongoose.model("Pessoa", schema);
