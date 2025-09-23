const multer = require("multer");

const EXCEL_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.ms-excel.sheet.binary.macroenabled.12",
];

const PDF_MIME_TYPE = "application/pdf";

const createMulterUpload = ({
  storage = multer.memoryStorage(),
  allowedMimeTypes,
  fileFilter,
  fileSizeLimit,
  limits = {},
  errorMessage = "Tipo de arquivo não suportado",
} = {}) => {
  const resolvedLimits = { ...limits };

  if (fileSizeLimit) {
    resolvedLimits.fileSize = fileSizeLimit;
  }

  const resolvedFileFilter =
    typeof fileFilter === "function"
      ? fileFilter
      : (req, file, cb) => {
          if (!Array.isArray(allowedMimeTypes) || allowedMimeTypes.length === 0) {
            cb(null, true);
            return;
          }

          const isAllowed = allowedMimeTypes.some((allowedType) => {
            if (allowedType instanceof RegExp) {
              return allowedType.test(file.mimetype);
            }

            return allowedType === file.mimetype;
          });

          if (isAllowed) {
            cb(null, true);
          } else {
            cb(new Error(errorMessage), false);
          }
        };

  return multer({
    storage,
    limits: resolvedLimits,
    fileFilter: resolvedFileFilter,
  });
};

const createExcelUpload = ({
  errorMessage = "Tipo de arquivo não suportado",
  fileSizeLimit = 20 * 1024 * 1024,
  ...options
} = {}) =>
  createMulterUpload({
    allowedMimeTypes: EXCEL_MIME_TYPES,
    errorMessage,
    fileSizeLimit,
    ...options,
  });

const createPdfAndImageUpload = ({
  errorMessage = "Apenas arquivos PDF ou imagens são permitidos",
  fileSizeLimit = 2 * 1024 * 1024,
  fileFilter,
  ...options
} = {}) => {
  const resolvedFileFilter =
    typeof fileFilter === "function"
      ? fileFilter
      : (req, file, cb) => {
          if (
            file.mimetype === PDF_MIME_TYPE ||
            file.mimetype.startsWith("image/")
          ) {
            cb(null, true);
          } else {
            cb(new Error(errorMessage), false);
          }
        };

  return createMulterUpload({
    errorMessage,
    fileSizeLimit,
    fileFilter: resolvedFileFilter,
    ...options,
  });
};

const uploadExcel = createExcelUpload();
const uploadPDFAndImage = createPdfAndImageUpload();

module.exports = {
  createMulterUpload,
  createExcelUpload,
  createPdfAndImageUpload,
  uploadExcel,
  uploadPDFAndImage,
};
