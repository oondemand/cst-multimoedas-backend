const XLSX = require("xlsx");

const arredondarValor = (valor) => {
  if (valor !== "") return Math.round(valor * 100) / 100;
};

const excelToJson = ({ arquivo, pageIndex = 0, emptyDefaultValue = "", header = 1 }) => {
  const workbook = XLSX.read(arquivo.buffer, {
    cellDates: true,
    type: "buffer",
  });
  const sheetName = workbook.SheetNames[pageIndex];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header,
    defval: emptyDefaultValue,
  });

  return jsonData;
};

const arrayToExcelBuffer = ({ array, title }) => {
  if (!array || array.length === 0) {
    return null;
  }

  const errorWorkbook = XLSX.utils.book_new();
  const errorWorksheet = XLSX.utils.json_to_sheet(array);
  XLSX.utils.book_append_sheet(errorWorkbook, errorWorksheet, title);

  return XLSX.write(errorWorkbook, {
    type: "buffer",
    bookType: "xlsx",
  });
};

module.exports = {
  arredondarValor,
  excelToJson,
  arrayToExcelBuffer,
};
