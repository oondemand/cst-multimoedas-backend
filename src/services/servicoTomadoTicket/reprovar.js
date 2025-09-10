const Ticket = require("../../models/ServicoTomadoTicket");
const GenericError = require("../errors/generic");
const { EtapaService } = require("central-oon-core-backend");

const reprovar = async ({ id }) => {
  const ticket = await Ticket.findById(id).populate("pessoa");

  const etapas = await EtapaService.listarEtapasAtivasPorEsteira({
    esteira: "servicos-tomados",
  });

  const etapaAtualIndex = etapas.findIndex((e) => e.codigo === ticket.etapa);

  if (etapaAtualIndex < 0) {
    throw new GenericError("Não foi possível reprovar ticket, etapa inválida");
  }

  ticket.etapa = etapas[etapaAtualIndex - 1].codigo;
  ticket.status = "revisao";
  await ticket.save();

  return ticket;
};

module.exports = {
  reprovar,
};
