const { Router } = require("express");
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");
const DashboardController = require("../controllers/dashboard");
const router = Router();

router.get("/estatisticas", asyncHandler(DashboardController.estatisticas));

module.exports = router;
