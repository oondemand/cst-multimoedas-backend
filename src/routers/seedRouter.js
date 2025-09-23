const express = require("express");
const router = express.Router();

const BaseOmie = require("../models/BaseOmie");
const Usuario = require("../models/Usuario");
const Lista = require("../models/Lista");
// const Banco = require("../models/Banco");
// const Estado = require("../models/Estado");
const Etapa = require("../models/Etapa");
const Sistema = require("../models/Sistema");
const ListaOmie = require("../models/ListaOmie");
const Assistente = require("../models/Assistente");
const Moeda = require("../models/Moeda");
const IntegracaoConfig = require("../models/IntegracaoConfig");

// const bancos = require("../seeds/bancos.json");
// const estados = require("../seeds/estados.json");
const listaomies = require("../seeds/listaomies.json");
const sistemas = require("../seeds/sistemas.json");
const etapas = require("../seeds/etapas.json");
const assistentes = require("../seeds/assistentes.json");
const moedas = require("../seeds/moedas.json");
const integracoes = require("../seeds/integracao.json");

const {
  sendErrorResponse,
  sendResponse,
  asyncHandler,
} = require("../../central-oon-core-backend/utils/helpers");

const seed = async (req, res) => {
  const { baseOmie, appKey, openIaKey } = req.body;

  const baseOmieExistente = await BaseOmie.findOne();
  if (baseOmieExistente) {
    return sendErrorResponse({
      res,
      statusCode: 400,
      message: "Ativação já realizada",
    });
  }

  if (!baseOmie || !appKey) {
    return sendErrorResponse({
      res,
      statusCode: 400,
      message: "Dados incompletos",
    });
  }

  await BaseOmie.create(baseOmie);

  for (const assistente of assistentes) {
    await Assistente.create(assistente);
  }

  for (const etapa of etapas) {
    await Etapa.create(etapa);
  }

  for (const sistema of sistemas) {
    await Sistema.create({ ...sistema, appKey, openIaKey });
  }

  for (const listaomie of listaomies) {
    await ListaOmie.create(listaomie);
  }

  for (const moeda of moedas) {
    await Moeda.create(moeda);
  }

  for (const integracao of integracoes) {
    await IntegracaoConfig.create(integracao);
  }

  return sendResponse({
    res,
    statusCode: 200,
    message: "Ativação realizada com sucesso!",
  });
};

router.post("/", asyncHandler(seed));
module.exports = router;
