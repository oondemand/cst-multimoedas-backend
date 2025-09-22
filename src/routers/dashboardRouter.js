const { Router } = require("express");
const { asyncHandler } = require("../../packages/central-oon-core-backend/src/utils/helpers");
const DashboardController = require("../controllers/dashboard");
const router = Router();

router.get("/estatisticas", asyncHandler(DashboardController.estatisticas));

module.exports = router;
