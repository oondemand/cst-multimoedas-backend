const { mapExporter } = require("../mapExporter.js");
const ClienteService = require("../../../omie/clienteService.js");
const BaseOmie = require("../../../../models/BaseOmie.js");
const { processarIntegracao } = require("../../../queue/defaultHandler.js");
const ServicoTomadoTicket = require("../../../../models/ServicoTomadoTicket.js");
const PessoaSync = require("../../../pessoa/omie");
const ContaPagarService = require("../../../omie/contaPagarService.js");
const ContaPagar = require("../../../../models/ContaPagar.js");

const handler = async (integracao) => {
  return processarIntegracao({
    integracao,
    executor: async (integracao) => {
      const { appKey, appSecret } = await BaseOmie.findOne({ status: "ativo" });

      const ticket = await ServicoTomadoTicket.findOne({
        contaPagarOmie: integracao.parentId,
      }).populate("servicos pessoa");

      const clienteOmie = await ClienteService.buscarClienteOmie({
        appKey,
        appSecret,
        pessoa: ticket.pessoa,
      });

      if (!clienteOmie) {
        PessoaSync.centralOmie.addTask({
          pessoa: ticket.pessoa,
        });
      }

      const conta = mapExporter({
        contaPagar: {
          ...integracao.payload,
          codigo_cliente_fornecedor: clienteOmie.codigo_cliente_omie,
        },
      });

      integracao.requisicao = {
        url: `${process.env.API_OMIE}/financas/contapagar/`,
        body: {
          call: "IncluirContaPagar",
          app_key: appKey,
          app_secret: appSecret,
          param: [conta],
        },
      };

      const contaPagarOmie = await ContaPagarService.incluir(
        appKey,
        appSecret,
        conta
      );

      integracao.contaPagar = { ...integracao.contaPagar, ...contaPagarOmie };
      await integracao.save();

      const contaPagarCentral = await ContaPagar.findByIdAndUpdate(
        integracao.parentId,
        { ...contaPagarOmie },
        { new: true }
      );

      // if (ticket.arquivos && ticket.arquivos.length > 0) {
      // }

      // Criar integracao de anexos

      return contaPagarOmie;
    },
    onSuccess: async (integracao, resultado) => {
      const ticket = await ServicoTomadoTicket.findOne({
        contaPagarOmie: integracao.parentId,
      });
      if (ticket.arquivos && ticket.arquivos.length > 0) {
        integracao.etapa = "anexos";
        await integracao.save();
      }
    },
  });
};

module.exports = {
  handler,
};
