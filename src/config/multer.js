const multer = require("multer");

const uploadExcel = multer({
  storage: multer.memoryStorage({}),
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/vnd.ms-excel.sheet.binary.macroenabled.12",
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não suportado"), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // Limite de 20MB
});

const uploadPDF = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const tipoPDF = "application/pdf";

    if (file.mimetype === tipoPDF) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos PDF são permitidos"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2MB
});

module.exports = {
  uploadExcel,
  uploadPDF,
};
