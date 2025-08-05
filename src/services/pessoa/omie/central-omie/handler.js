const { mapExporter } = require("../mapExporter.js");
const ClienteService = require("../../../omie/clienteService.js");
const Pessoa = require("../../../../models/Pessoa");
const BaseOmie = require("../../../../models/BaseOmie.js");
const { randomUUID } = require("crypto");
const { processarIntegracao } = require("../../../queue/defaultHandler.js");

const handler = async (integracao) => {
  return processarIntegracao({
    integracao,
    executor: async (integracao) => {
      const cliente = mapExporter({
        pessoa: integracao.payload,
      });
      const { appKey, appSecret } = await BaseOmie.findOne({ status: "ativo" });
      const clienteOmieExistente = await ClienteService.buscarClienteOmie({
        pessoa: integracao.payload,
        appKey,
        appSecret,
      });
      integracao.requisicao = {
        url: `${process.env.API_OMIE}/geral/clientes/`,
        body: {
          call: clienteOmieExistente ? "AlterarCliente" : "IncluirCliente",
          app_key: appKey,
          app_secret: appSecret,
          param: [cliente],
        },
      };
      if (clienteOmieExistente) {
        cliente.codigo_cliente_omie = clienteOmieExistente.codigo_cliente_omie;
        return await ClienteService.update(appKey, appSecret, cliente);
      }
      if (!clienteOmieExistente) {
        cliente.codigo_cliente_integracao = randomUUID();
        return await ClienteService.incluir(appKey, appSecret, cliente);
      }
    },
    onSuccess: async (integracao, resultado) => {
      await Pessoa.findByIdAndUpdate(integracao.parentId, {
        status_sincronizacao_omie: "sucesso",
        codigo_cliente_omie: resultado.codigo_cliente_omie,
      });
    },
    onError: async (integracao, _) => {
      await Pessoa.findByIdAndUpdate(integracao.parentId, {
        status_sincronizacao_omie:
          integracao.tentativas > 3 ? "erro" : "pendente",
      });
    },
  });
};

module.exports = {
  handler,
};
