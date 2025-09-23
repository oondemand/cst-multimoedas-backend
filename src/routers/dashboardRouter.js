const { Router } = require("express");
const { asyncHandler } = require("../../central-oon-core-backend/utils/helpers");
const DashboardController = require("../controllers/dashboard");
const router = Router();

router.get("/estatisticas", asyncHandler(DashboardController.estatisticas));

module.exports = router;
