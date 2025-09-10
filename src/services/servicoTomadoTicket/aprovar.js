const Ticket = require("../../models/ServicoTomadoTicket");
const GenericError = require("../errors/generic");
const { EtapaService } = require("central-oon-core-backend");
const ContaPagar = require("../../models/ContaPagar");
const { Sistema } = require("central-oon-core-backend");
const ContaPagarSync = require("../contaPagar/omie");
const { add } = require("date-fns");
const { randomUUID } = require("crypto");
const ServicoService = require("../servico");

const alterarEtapa = async ({ ticket, etapa }) => {
  ticket.etapa = etapa;
  ticket.status = "aguardando-inicio";
  return await ticket.save();
};

const aprovar = async ({ id }) => {
  const ticket = await Ticket.findById(id)
    .populate({
      path: "servicos",
      populate: { path: "moeda" },
    })
    .populate("pessoa");

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

  if (etapaAtualIndex > ultimaEtapa || etapaAtualIndex < 0) {
    throw new GenericError("Não foi possível aprovar ticket, etapa inválida");
  }

  const { tipo, cadastro_aprovado } = ticket.pessoa;
  const { etapa } = ticket;

  if (ticket.etapa === "aprovacao-cadastro") {
    if (!cadastro_aprovado) {
      ticket.pessoa.cadastro_aprovado = true;
      await ticket.pessoa.save();
    }
  }

  if (tipo === "pj") {
    if (etapa === "aprovacao-cadastro") {
      return await alterarEtapa({
        ticket,
        etapa: etapas[etapaAtualIndex + 2].codigo,
      });
    }

    if (cadastro_aprovado && etapa === "requisicao") {
      return await alterarEtapa({
        ticket,
        etapa: etapas[etapaAtualIndex + 3].codigo,
      });
    }
  }

  if (etapa === "requisicao" && cadastro_aprovado) {
    return await alterarEtapa({
      etapa: etapas[etapaAtualIndex + 2].codigo,
      ticket,
    });
  }

  if (etapa === "aprovacao-fiscal" && ticket?.servicos?.length > 0) {
    const servicosComCotacao = await ServicoService.fixarCotacao({
      servicos: ticket.servicos,
    });

    const valorTotalDosServicos =
      servicosComCotacao.reduce((total, servico) => {
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

    return await alterarEtapa({
      etapa: etapas[etapaAtualIndex + 1].codigo,
      ticket,
    });
  }

  return await alterarEtapa({
    etapa: etapas[etapaAtualIndex + 1].codigo,
    ticket,
  });
};

module.exports = {
  aprovar,
};
