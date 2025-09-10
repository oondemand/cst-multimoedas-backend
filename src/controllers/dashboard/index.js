const { helpers: Helpers, IntegracaoService } = require("central-oon-core-backend");
const ServicoService = require("../../services/servico");
const ServicoTomadoTicketService = require("../../services/servicoTomadoTicket");

const estatisticas = async (req, res) => {
  const ticketPorStatus =
    await ServicoTomadoTicketService.listarTicketsPorStatus();

  const ticketPorEtapa =
    await ServicoTomadoTicketService.listarTicketsPorEtapa();

  const valoresPorStatus = await ServicoService.valoresPorStatus();

  const integracao =
    await IntegracaoService.listarIntegracoesAgrupadasPorDirecaoTipo();

  Helpers.sendResponse({
    res,
    estatisticas: {
      ticketPorEtapa,
      ticketPorStatus,
      valoresPorStatus,
      integracao: integracao.reduce((acc, { tipo, direcao, etapas }) => {
        if (!acc[tipo]) acc[tipo] = {};
        acc[tipo][direcao] = etapas;
        return acc;
      }, {}),
    },
    statusCode: 200,
  });
};

module.exports = { estatisticas };
