const express = require("express");

const PessoaWebhook = require("../controllers/pessoa/omie/webhook");
const ContaPagarWebhook = require("../controllers/contaPagar/omie/webhook");

const { asyncHandler } = require("../../packages/central-oon-core-backend/src/utils/helpers");
const router = express.Router();

router.post("/pessoa", asyncHandler(PessoaWebhook.SyncPessoa));
router.post("/conta-pagar", asyncHandler(ContaPagarWebhook.SyncContaPagar));

module.exports = router;
