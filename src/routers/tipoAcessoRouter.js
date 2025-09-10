const express = require("express");
const router = express.Router();
const { helpers: Helpers } = require("central-oon-core-backend");

router.get(
  "/",
  Helpers.asyncHandler(async (req, res) => {
    const options = [
      { label: "Prestador", value: "prestador" },
      { label: "Tomador", value: "tomador" },
      { label: "Admin", value: "admin" },
      { label: "Contabilidade", value: "contabilidade" },
    ];

    Helpers.sendResponse({
      res,
      statusCode: 200,
      options,
    });
  })
);

module.exports = router;
