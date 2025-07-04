const express = require("express");

const PessoaWebhook = require("../controllers/pessoa/omie/webhook");
const { asyncHandler } = require("../utils/helpers");
const router = express.Router();

router.post("/pessoa", asyncHandler(PessoaWebhook.SyncPessoa));
module.exports = router;
