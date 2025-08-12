const ServicoTomadoTicket = require("../../models/ServicoTomadoTicket");
const Servico = require("../../models/Servico");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const { aprovar } = require("./aprovar");
const { reprovar } = require("./reprovar");
const TicketNaoEncontradoError = require("../errors/ticket/ticketNaoEncontrado");
const GenericError = require("../errors/generic");
const Arquivo = require("../../models/Arquivo");
const ServicoNaoEncontradoError = require("../errors/servico/servicoNaoEncontrado");
const { criarNomePersonalizado } = require("../../utils/formatters");
const ArquivoNaoEncontradoError = require("../errors/arquivo/arquivoNaoEncontradoError");
const EtapaService = require("../etapa");

const criar = async ({ ticket }) => {
  const etapas = await EtapaService.listarEtapasAtivasPorEsteira({
    esteira: "servicos-tomados",
  });

  const novoTicket = new ServicoTomadoTicket({
    ...ticket,
    etapa: etapas[0]?.codigo,
  });
  await novoTicket.save();
  return novoTicket;
};

const listar = async ({ time = 1 }) => {
  const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;

  const tickets = await ServicoTomadoTicket.find({
    status: { $nin: ["arquivado"] },
    updatedAt: {
      $gte: new Date(Date.now() - Number(time) * umDiaEmMilissegundos),
    },
  })
    .populate({
      path: "servicos",
      populate: { path: "moeda" },
    })
    .populate("pessoa")
    .populate("contaPagarOmie")
    .populate("arquivos");

  return tickets;
};

const atualizar = async ({ id, ticket }) => {
  const ticketAtualizado = await ServicoTomadoTicket.findByIdAndUpdate(
    id,
    ticket,
    { new: true }
  )
    .populate("servicos")
    .populate("pessoa");

  if (!ticketAtualizado) throw new TicketNaoEncontradoError();

  return ticketAtualizado;
};

const obterPorId = async ({ id }) => {
  const ticket = await ServicoTomadoTicket.findById(id)
    .populate("servicos")
    .populate("pessoa");

  if (!ticket || !id) throw new TicketNaoEncontradoError();

  return ticket;
};

const excluir = async ({ id }) => {
  const ticket = await ServicoTomadoTicket.findById(id);

  if (!ticket || !id) throw new TicketNaoEncontradoError();

  ticket.status = "arquivado";
  await ticket.save();
  return ticket;
};

const listarComPaginacao = async ({
  filtros,
  pessoaFiltros,
  searchTerm,
  pageIndex,
  pageSize,
}) => {
  const queryTicket = FiltersUtils.buildQuery({
    filtros,
    schema: ServicoTomadoTicket.schema,
    searchTerm,
    camposBusca: ["titulo", "createdAt"],
  });

  const queryCombinada = {
    $and: [...queryTicket, { status: "arquivado" }],
  };

  const { page, skip, limite } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [tickets, totalDeTickets] = await Promise.all([
    ServicoTomadoTicket.find(queryCombinada)
      .skip(skip)
      .limit(limite)
      .populate("servicos")
      .populate("pessoa")
      .populate("contaPagarOmie"),
    ServicoTomadoTicket.countDocuments(queryCombinada),
  ]);

  return { tickets, totalDeTickets, page, limite };
};

const adicionarServico = async ({ ticketId, servicoId }) => {
  const servico = await Servico.findById(servicoId);
  const ticket = await ServicoTomadoTicket.findById(ticketId);

  if (!servico) throw new ServicoNaoEncontradoError();
  if (!ticket) throw new TicketNaoEncontradoError();

  servico.statusProcessamento = "processando";
  await servico.save();

  ticket.servicos = [...ticket?.servicos, servico?._id];
  await ticket.save();

  const ticketPopulado = await ServicoTomadoTicket.findById(
    ticket._id
  ).populate("servicos");

  return ticketPopulado;
};

const removerServico = async ({ servicoId }) => {
  const servico = await Servico.findByIdAndUpdate(
    servicoId,
    { statusProcessamento: "aberto" },
    { new: true }
  );

  if (!servico) throw new ServicoNaoEncontradoError();

  const ticket = await ServicoTomadoTicket.findOneAndUpdate(
    { servicos: servicoId }, // Busca o ticket que contém este serviço
    { $pull: { servicos: servicoId } }, // Remove o serviço do array
    { new: true }
  ).populate("servicos");

  if (!ticket) throw new TicketNaoEncontradoError();

  return ticket;
};

const adicionarArquivo = async ({ id, arquivos }) => {
  const ticket = await ServicoTomadoTicket.findById(id);

  if (!ticket) throw new TicketNaoEncontradoError();
  if (!Array.isArray(arquivos) || arquivos.length === 0)
    throw new GenericError(
      "Nenhum arquivo enviado para adicionar ao ticket.",
      400
    );

  const arquivosSalvos = await Promise.all(
    arquivos.map(async (file) => {
      const arquivo = new Arquivo({
        nome: criarNomePersonalizado({ nomeOriginal: file.originalname }),
        nomeOriginal: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        ticket: ticket._id,
        buffer: file.buffer,
      });

      await arquivo.save();
      return arquivo;
    })
  );

  ticket.arquivos.push(...arquivosSalvos.map((a) => a._id));
  await ticket.save();
  return arquivosSalvos;
};

const removerArquivo = async ({ ticketId, arquivoId }) => {
  const arquivo = await Arquivo.findByIdAndDelete(arquivoId);
  if (!arquivo) throw new ArquivoNaoEncontradoError();

  const ticket = await ServicoTomadoTicket.findByIdAndUpdate(ticketId, {
    $pull: { arquivos: arquivoId },
  });
  if (!ticket) throw new TicketNaoEncontradoError();

  return arquivo;
};

const listarTicketsPorEtapa = async () => {
  const pipeline = [
    { $match: { status: { $ne: "arquivado" } } },
    { $group: { _id: "$etapa", count: { $sum: 1 } } },
    { $project: { _id: 0, etapa: "$_id", count: 1 } },
  ];

  return await ServicoTomadoTicket.aggregate(pipeline);
};

const listarTicketsPorStatus = async () => {
  const pipeline = [
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", count: 1 } },
  ];

  return await ServicoTomadoTicket.aggregate(pipeline);
};

module.exports = {
  criar,
  listar,
  aprovar,
  excluir,
  reprovar,
  atualizar,
  obterPorId,
  removerArquivo,
  removerServico,
  adicionarArquivo,
  adicionarServico,
  listarComPaginacao,
  listarTicketsPorEtapa,
  listarTicketsPorStatus,
};
