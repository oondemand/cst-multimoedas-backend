const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const status = {
    0: "Desconectado",
    1: "Conectado",
    2: "Conectando",
    3: "Desconectando",
  };

  res.status(200).json({
    message: `${process.env.SERVICE_NAME} rodando - vs ${process.env.SERVICE_VERSION}`,
    database: status[dbState]
      ? `${status[dbState]} em ${process.env.DB_NAME}`
      : "Status desconhecido",
  });
});

module.exports = router;
