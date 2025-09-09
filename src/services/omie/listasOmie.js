const { createHttpClient } = require("central-oon-core-backend");

const apiOmie = createHttpClient({ baseURL: process.env.API_OMIE });

function filterFields(sourceObj, fieldTemplate) {
  const result = {};
  let hasEntries = false;

  if (
    sourceObj === null ||
    typeof sourceObj !== "object" ||
    Array.isArray(sourceObj)
  )
    return result;
  if (
    fieldTemplate === null ||
    typeof fieldTemplate !== "object" ||
    Array.isArray(fieldTemplate)
  )
    return result;

  for (const key in fieldTemplate) {
    if (!Object.hasOwn(fieldTemplate, key)) continue;

    const templateValue = fieldTemplate[key];
    const sourceValue = sourceObj[key];

    if (
      typeof templateValue === "object" &&
      templateValue !== null &&
      !Array.isArray(templateValue)
    ) {
      if (
        typeof sourceValue === "object" &&
        sourceValue !== null &&
        !Array.isArray(sourceValue)
      ) {
        const nested = filterFields(sourceValue, templateValue);
        const nestedKeys = Object.keys(nested);

        if (nestedKeys.length > 0) {
          result[key] = nested;
          hasEntries = true;
        }
      }
    } else if (templateValue === true && Object.hasOwn(sourceObj, key)) {
      result[key] = sourceValue;
      hasEntries = true;
    }
  }

  return hasEntries ? result : {};
}

exports.ListaOmieService = async ({ call, url, baseOmie, select, fields }) => {
  try {
    let pagina = 1;
    let totalPaginas = 1;
    let resultados = [];

    while (pagina <= totalPaginas) {
      const response = await apiOmie.post(url, {
        call,
        app_key: baseOmie.appKey,
        app_secret: baseOmie.appSecret,
        param: [{ pagina }],
      });

      if (
        !response?.data ||
        !response.data.total_de_paginas ||
        !response.data[select]
      ) {
        throw new Error("Resposta da API inválida");
      }

      totalPaginas = response.data.total_de_paginas;

      resultados = [
        ...resultados,
        ...response.data[select].map((obj) => filterFields(obj, fields)),
      ];

      if (pagina < totalPaginas)
        await new Promise((resolve) => setTimeout(resolve, 500));

      pagina++;
    }

    return resultados;
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    throw new Error(`Falha ao processar: ${error.message}`);
  }
};
