const apiOmie = require("../../config/apiOmie");

const cache = {};
const consultar = async (appKey, appSecret, codCliente) => {
  const cacheKey = `cliente_${codCliente}`;
  const now = Date.now();

  // Verificar se o cliente está no cache e se ainda é válido (10 minuto)
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < 600000) {
    return cache[cacheKey].data;
  }

  try {
    const body = {
      call: "ConsultarCliente",
      app_key: appKey,
      app_secret: appSecret,
      param: [
        {
          codigo_cliente_omie: codCliente,
        },
      ],
    };

    const response = await apiOmie.post("geral/clientes/", body);
    const data = response.data;

    // Armazenar a resposta no cache com um timestamp
    cache[cacheKey] = {
      data: data,
      timestamp: now,
    };

    return data;
  } catch (error) {
    if (
      error.response?.data?.faultstring?.includes(
        "Consumo redundante detectado"
      )
    )
      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

    if (error.response?.data?.faultstring)
      throw "Erro ao consultar cliente: " + error.response.data.faultstring;
    if (error.response?.data)
      throw "Erro ao consultar cliente: " + error.response.data;
    if (error.response) throw "Erro ao consultar cliente: " + error.response;
    throw "Erro ao consultar cliente: " + error;
  }
};

const incluir = async (appKey, appSecret, cliente) => {
  const body = {
    call: "IncluirCliente",
    app_key: appKey,
    app_secret: appSecret,
    param: [cliente],
  };

  const response = await apiOmie.post("geral/clientes/", body);
  return response.data;
};

const update = async (appKey, appSecret, cliente, maxTentativas = 3) => {
  const body = {
    call: "AlterarCliente",
    app_key: appKey,
    app_secret: appSecret,
    param: [cliente],
  };

  const response = await apiOmie.post("geral/clientes/", body);
  return response.data;
};

const cachePesquisaPorCNPJ = {};
const pesquisarPorCNPJ = async (appKey, appSecret, cnpj, maxTentativas = 3) => {
  const cacheKey = `cnpj_${cnpj}`;
  const now = Date.now();

  let tentativas = 0;

  if (
    cachePesquisaPorCNPJ[cacheKey] &&
    now - cachePesquisaPorCNPJ[cacheKey].timestamp < 60 * 1000
  ) {
    return cachePesquisaPorCNPJ[cacheKey].data;
  }
  while (tentativas < maxTentativas) {
    try {
      const body = {
        call: "ListarClientes",
        app_key: appKey,
        app_secret: appSecret,
        param: [
          {
            pagina: 1,
            registros_por_pagina: 50,
            clientesFiltro: {
              cnpj_cpf: cnpj,
            },
          },
        ],
      };

      const response = await apiOmie.post("geral/clientes/", body);
      const data = response.data?.clientes_cadastro[0];

      // Armazenar a resposta no cache com um timestamp
      cachePesquisaPorCNPJ[cacheKey] = {
        data: data,
        timestamp: now,
      };

      return data;
    } catch (error) {
      if (
        error.response?.data?.faultstring?.includes(
          "ERROR: Não existem registros para a página [1]!"
        )
      ) {
        return null;
      }

      tentativas++;
      if (
        error.response?.data?.faultstring?.includes(
          "API bloqueada por consumo indevido."
        )
      ) {
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000 * 5));
      }

      if (
        error.response?.data?.faultstring?.includes(
          "Consumo redundante detectado"
        )
      ) {
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
      }
    }
  }

  throw `Falha ao buscar prestador após ${maxTentativas} tentativas.`;
};

const consultarCaracteristicas = async ({
  appKey,
  appSecret,
  codigo_cliente_omie,
}) => {
  try {
    const body = {
      call: "ConsultarCaractCliente",
      app_key: appKey,
      app_secret: appSecret,
      param: [{ codigo_cliente_omie }],
    };

    const response = await apiOmie.post("geral/clientescaract/", body);
    return response?.data?.caracteristicas;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const buscarClienteOmie = async ({ pessoa, appKey, appSecret }) => {
  if (pessoa?.codigo_cliente_omie) {
    const cliente = await consultar(
      appKey,
      appSecret,
      pessoa?.codigo_cliente_omie
    );

    return cliente;
  }

  if (pessoa?.documento) {
    const cliente = await pesquisarPorCNPJ(appKey, appSecret, pessoa.documento);
    return cliente;
  }

  return null;
};

module.exports = {
  update,
  incluir,
  consultar,
  pesquisarPorCNPJ,
  buscarClienteOmie,
  consultarCaracteristicas,
};
