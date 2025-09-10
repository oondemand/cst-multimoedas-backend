const express = require("express");

const PessoaWebhook = require("../controllers/pessoa/omie/webhook");
const ContaPagarWebhook = require("../controllers/contaPagar/omie/webhook");

const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");
const router = express.Router();

router.post("/pessoa", asyncHandler(PessoaWebhook.SyncPessoa));
router.post("/conta-pagar", asyncHandler(ContaPagarWebhook.SyncContaPagar));

module.exports = router;
