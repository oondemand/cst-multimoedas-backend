const { mapExporter } = require("../mapExporter.js");
const ClienteService = require("../../../omie/clienteService.js");
const BaseOmie = require("../../../../models/BaseOmie.js");
const { processarIntegracao } = require("../../../queue/defaultHandler.js");
const ServicoTomadoTicket = require("../../../../models/ServicoTomadoTicket.js");
const PessoaSync = require("../../../pessoa/omie");
const ContaPagarService = require("../../../omie/contaPagarService.js");
const ContaPagar = require("../../../../models/ContaPagar.js");
const ArquivoSync = require("../../../arquivo/omie");

const handler = async (integracao) => {
  return processarIntegracao({
    integracao,
    executor: async (integracao) => {
      console.log("Running conta-pagar");

      const { appKey, appSecret } = await BaseOmie.findOne({ status: "ativo" });

      const ticket = await ServicoTomadoTicket.findOne({
        contaPagarOmie: integracao.parentId,
      }).populate("servicos pessoa arquivos");

      const clienteOmie = await ClienteService.buscarClienteOmie({
        appKey,
        appSecret,
        pessoa: ticket.pessoa,
      });

      console.log("Pessoa", ticket.pessoa);

      if (!clienteOmie) {
        PessoaSync.centralOmie.addTask({
          pessoa: ticket.pessoa,
        });

        throw new Error(
          "Prestador não sincronizado com o omie! Criando ticket de sincronização!"
        );
      }

      const conta = mapExporter({
        contaPagar: {
          ...integracao.payload,
          codigo_cliente_fornecedor: clienteOmie?.codigo_cliente_omie,
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

      const contaPagar = await ContaPagar.findByIdAndUpdate(
        integracao.parentId,
        { ...contaPagarOmie },
        { new: true }
      );

      if (ticket.arquivos && ticket.arquivos.length > 0) {
        ticket.arquivos.forEach((arquivo) => {
          ArquivoSync.centralOmie.addTask({
            arquivo: arquivo.toObject(),
            contaPagar,
          });
        });
      }

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

    onError: async (integracao, resultado) => {
      await ServicoTomadoTicket.findOneAndUpdate(
        { contaPagarOmie: integracao.parentId },
        { status: "revisao" }
      );
    },
  });
};

module.exports = {
  handler,
};
