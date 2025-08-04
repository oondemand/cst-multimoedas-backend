const Ticket = require("../../models/ServicoTomadoTicket");
const GenericError = require("../errors/generic");
const EtapaService = require("../etapa");
const ContaPagar = require("../../models/ContaPagar");
const Sistema = require("../../models/Sistema");
const ContaPagarSync = require("../contaPagar/omie");
const { add } = require("date-fns");
const { randomUUID } = require("crypto");

const aprovar = async ({ id }) => {
  const ticket = await Ticket.findById(id).populate("pessoa servicos");

  const etapas = await EtapaService.listarEtapasAtivasPorEsteira({
    esteira: "servicos-tomados",
  });

  const ultimaEtapa = etapas.length - 1;
  const etapaAtualIndex = etapas.findIndex((e) => e.codigo === ticket.etapa);

  if (etapaAtualIndex === ultimaEtapa) {
    ticket.etapa = "concluido";
    ticket.status = "concluido";
    await ticket.save();
    return ticket;
  }

  if (ticket.etapa === "aprovacao-fiscal" && ticket?.servicos?.length > 0) {
    const valorTotalDosServicos =
      ticket?.servicos?.reduce((total, servico) => {
        return total + (servico?.valor || 0);
      }, 0) ?? 0;

    const config = await Sistema.findOne();

    const dataAtual = new Date();
    const dataVencimento = add(dataAtual, { hours: 24 });

    if (valorTotalDosServicos > 0) {
      const conta = await ContaPagar.create({
        status_titulo: "A VENCER",
        data_emissao: dataAtual,
        data_vencimento: dataVencimento,
        data_entrada: dataAtual,
        data_previsao: dataVencimento,
        codigo_lancamento_integracao: randomUUID(),
        numero_documento: `oon-${1}`,
        valor_documento: valorTotalDosServicos,
        codigo_categoria:
          ticket?.codigo_categoria ?? config?.omie?.codigo_categoria,
        id_conta_corrente:
          ticket?.conta_corrente ?? config?.omie?.id_conta_corrente,
      });

      ContaPagarSync.centralOmie.addTask({
        ticket,
        contaPagar: conta,
      });

      ticket.contaPagarOmie = conta._id;
      await ticket.save();
    }
  }

  if (etapaAtualIndex > ultimaEtapa || etapaAtualIndex < 0) {
    throw new GenericError("Não foi possível aprovar ticket, etapa inválida");
  }

  ticket.etapa = etapas[etapaAtualIndex + 1].codigo;
  ticket.status = "aguardando-inicio";
  await ticket.save();

  return ticket;
};

module.exports = {
  aprovar,
};
