const axios = require("axios");

/**
 * Cria uma instância configurada do Axios.
 * @param {Object} options
 * @param {string} options.baseURL - URL base para as requisições.
 * @param {number} [options.timeout=30000] - Tempo limite em milissegundos.
 * @returns {import('axios').AxiosInstance}
 */
const createHttpClient = ({ baseURL, timeout = 30000 } = {}) => {
  return axios.create({
    baseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

module.exports = createHttpClient;
