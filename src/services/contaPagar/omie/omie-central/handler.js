const { mapExporter } = require("../mapExporter.js");
const ClienteService = require("../../../omie/clienteService.js");
const BaseOmie = require("../../../../models/BaseOmie.js");
const { processarIntegracao } = require("../../../queue/defaultHandler.js");
const ServicoTomadoTicket = require("../../../../models/ServicoTomadoTicket.js");
const PessoaSync = require("../../../pessoa/omie/index.js");
const ContaPagarService = require("../../../omie/contaPagarService.js");
const ContaPagar = require("../../../../models/ContaPagar.js");
const ContaPagarNaoEncontradoError = require("../../../errors/contaPagar/contaPagarNaoEncontrado.js");
const Servico = require("../../../../models/Servico.js");

const handler = async (integracao) => {
  return processarIntegracao({
    integracao,
    executor: async (integracao) => {
      const { topic } = integracao?.requisicao?.body;

      if (topic === "Financas.ContaPagar.Alterado") {
        const contaPagar = await ContaPagar.findOneAndUpdate(
          { codigo_lancamento_omie: integracao.externalId },
          { ...integracao.requisicao.body.event }
        );

        if (!contaPagar) throw new ContaPagarNaoEncontradoError();

        const ticket = await ServicoTomadoTicket.findOneAndUpdate(
          { contaPagarOmie: contaPagar._id },
          { etapa: "conta-pagar-omie-central", status: "trabalhando" }
        );

        integracao.parentId = contaPagar;
        integracao.titulo = `Central <- omie: ${ticket.titulo}`;
        integracao.payload = contaPagar;
        await integracao.save();
      }

      if (topic === "Financas.ContaPagar.Excluido") {
        const contaPagar = await ContaPagar.findOneAndDelete({
          codigo_lancamento_omie: integracao.externalId,
        });

        if (!contaPagar) throw new ContaPagarNaoEncontradoError();

        const ticket = await ServicoTomadoTicket.findOneAndUpdate(
          { contaPagarOmie: contaPagar._id },
          {
            status: "revisao",
            etapa: "aprovacao-fiscal",
            contaPagarOmie: null,
            observacao: "[CONTA A PAGAR REMOVIDA DO OMIE]",
          }
        );

        integracao.parentId = contaPagar;
        integracao.titulo = `Central <- omie: ${ticket.titulo}`;
        integracao.payload = contaPagar;
        await integracao.save();

        if (ticket.servicos && ticket.servicos.length > 0) {
          await Servico.updateMany(
            { _id: { $in: ticket?.servicos } },
            { statusProcessamento: "processando" }
          );
        }
      }

      if (topic === "Financas.ContaPagar.BaixaCancelada") {
        const contaPagar = await ContaPagar.findOneAndUpdate(
          { codigo_lancamento_omie: integracao.externalId },
          { ...integracao.requisicao.body.event, status_titulo: "A VENCER" }
        );

        if (!contaPagar) throw new ContaPagarNaoEncontradoError();

        const ticket = await ServicoTomadoTicket.findOneAndUpdate(
          { contaPagarOmie: contaPagar._id },
          { etapa: "conta-pagar-omie-central", status: "trabalhando" }
        );

        integracao.parentId = contaPagar;
        integracao.titulo = `Central <- omie: ${ticket.titulo}`;
        integracao.payload = contaPagar;
        await integracao.save();

        if (ticket.servicos && ticket.servicos.length > 0) {
          await Servico.updateMany(
            { _id: { $in: ticket?.servicos } },
            { statusProcessamento: "processando" }
          );
        }
      }

      if (topic === "Financas.ContaPagar.BaixaRealizada") {
        const contaPagar = await ContaPagar.findOneAndUpdate(
          { codigo_lancamento_omie: integracao.externalId },
          { ...integracao.requisicao.body.event, status_titulo: "PAGO" }
        );

        if (!contaPagar) throw new ContaPagarNaoEncontradoError();

        const ticket = await ServicoTomadoTicket.findOneAndUpdate(
          { contaPagarOmie: contaPagar._id },
          { etapa: "conta-pagar-omie-central", status: "trabalhando" }
        );

        integracao.parentId = contaPagar;
        integracao.titulo = `Central <- omie: ${ticket.titulo}`;
        integracao.payload = contaPagar;
        await integracao.save();

        if (ticket.servicos && ticket.servicos.length > 0) {
          await Servico.updateMany(
            { _id: { $in: ticket?.servicos } },
            { statusProcessamento: "pago" }
          );
        }
      }

      return { message: "Conta pagar sincronizada com sucesso!" };
    },
  });
};

module.exports = {
  handler,
};
