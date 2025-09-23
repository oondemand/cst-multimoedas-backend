const express = require("express");
const router = express.Router();
const ListaController = require("../controllers/lista");
const { asyncHandler } = require("../../central-oon-core-backend/utils/helpers");

router.post("/", asyncHandler(ListaController.createLista));
router.get("/", asyncHandler(ListaController.getListas));
router.get("/codigos", asyncHandler(ListaController.obterCodigos));
router.get("/:codigo", asyncHandler(ListaController.getListaPorCodigo));
router.post("/:codigo/", asyncHandler(ListaController.addItem));
router.delete("/:codigo/:itemId", asyncHandler(ListaController.removeItem));
router.put("/:codigo", asyncHandler(ListaController.updateItem));

module.exports = router;
