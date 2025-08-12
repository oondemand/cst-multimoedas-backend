const {
  sendResponse,
  sendErrorResponse,
  sendPaginatedResponse,
} = require("../../utils/helpers");

const ServicoTomadoTicketService = require("../../services/servicoTomadoTicket");
const ServicoService = require("../../services/servico");

const aprovar = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.aprovar({
    id: req.params.id,
  });

  sendResponse({
    res,
    statusCode: 200,
    ticket,
  });
};

const reprovar = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.reprovar({
    id: req.params.id,
  });

  sendResponse({
    res,
    statusCode: 200,
    ticket,
  });
};

const createTicket = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.criar({ ticket: req.body });

  sendResponse({
    res,
    statusCode: 201,
    ticket,
  });
};

const updateTicket = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.atualizar({
    id: req.params.id,
    ticket: req.body,
  });

  sendResponse({
    res,
    statusCode: 200,
    ticket,
  });
};

const getAllTickets = async (req, res) => {
  const { time } = req.query;
  const tickets = await ServicoTomadoTicketService.listar({ time });

  const ticketsComServicosComCotacao = await Promise.all(
    tickets.map(async (ticket) => {
      return {
        ...ticket.toObject(),
        servicos: await ServicoService.adicionarCotacao({
          servicos: ticket.servicos,
        }),
      };
    })
  );

  sendResponse({
    res,
    statusCode: 200,
    tickets: ticketsComServicosComCotacao,
  });
};

const obterTicket = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.obterPorId({
    id: req.params.id,
  });

  sendResponse({
    res,
    statusCode: 201,
    ticket,
  });
};

// const getTicketsByUsuarioPrestador = async (req, res) => {
//   const { usuarioId } = req.params;

//   const prestador = await Prestador.findOne({ usuario: usuarioId });
//   const config = await Sistema.findOne();

//   if (!prestador) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Não foi encontrado um prestador com id fornecido.",
//     });
//   }

//   const tickets = await Ticket.find({
//     prestador: prestador._id,
//     status: { $ne: "arquivado" },
//     etapa: { $ne: "requisicao" },
//   })
//     .populate("servicos")
//     .populate("arquivos", "nomeOriginal size mimetype tipo");

//   // Busca serviços abertos não vinculados a tickets
//   const servicosAbertos = await Servico.find({
//     prestador: prestador._id,
//     status: { $in: ["aberto", "pendente"] },
//     $or: [
//       {
//         "competencia.ano": {
//           $gt: config.data_corte_app_publisher.getFullYear(),
//         },
//       },

//       {
//         $and: [
//           {
//             "competencia.ano": config.data_corte_app_publisher.getFullYear(),
//           },
//           {
//             "competencia.mes": {
//               $gte: config.data_corte_app_publisher.getMonth() + 1, // Ajuste para meses 1-12
//             },
//           },
//         ],
//       },
//     ],
//   }).select("-dataRegistro");

//   const servicosPagosExterno = await Servico.aggregate([
//     {
//       $match: {
//         prestador: prestador?._id,
//         status: "pago-externo",
//         dataRegistro: {
//           $exists: true,
//           $ne: null,
//           $gte: config?.data_corte_app_publisher,
//         },
//       },
//     },

//     {
//       $addFields: {
//         valor: {
//           $sum: {
//             $ifNull: ["$valor", 0],
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: {
//             format: "%Y-%m-%d",
//             date: "$dataRegistro",
//           },
//         },
//         servicos: { $push: "$$ROOT" },
//         status: { $first: "$status" },
//       },
//     },
//   ]);

//   // ticket virtual para serviços abertos
//   const fakeTicket = {
//     _id: servicosAbertos[0]?._id,
//     status: "aberto",
//     servicos: servicosAbertos,
//     arquivos: [],
//     observacao: "Serviço aberto não associado a um ticket",
//   };

//   // Converte tickets reais para objetos simples e combina com os virtuais
//   const allTickets = [
//     ...tickets,
//     ...(servicosAbertos.length > 0 ? [fakeTicket] : []),
//     ...servicosPagosExterno,
//   ];

//   // Ordenação definitiva considerando todos os cenários
//   allTickets.sort((a, b) => {
//     // Extrai datas de diferentes cenários
//     const getDate = (ticket) => {
//       if (ticket.dataRegistro) return ticket.dataRegistro; // Ticket normal
//       if (ticket.servicos?.[0]?.dataRegistro)
//         return ticket.servicos[0].dataRegistro; // Serviços pagos externos
//       return null;
//     };

//     const aDate = getDate(a);
//     const bDate = getDate(b);

//     if (!aDate && !bDate) return 0;
//     if (!aDate) return -1;
//     if (!bDate) return 1;

//     // Datas mais recentes primeiro
//     return new Date(bDate) - new Date(aDate);
//   });

//   let valorTotalRecebido = 0;
//   let valorTotalPendente = 0;

//   if (allTickets.length === 0) {
//     return sendResponse({
//       res,
//       statusCode: 200,
//       valorTotalRecebido,
//       valorTotalPendente,
//       tickets: [],
//     });
//   }

//   for (const ticket of allTickets) {
//     for (const servico of ticket.servicos) {
//       if (["pago", "pago-externo"].includes(servico.status)) {
//         valorTotalRecebido += servico.valor;
//         continue;
//       }

//       valorTotalPendente += servico.valor;
//     }
//   }

//   sendResponse({
//     res,
//     statusCode: 200,
//     valorTotalRecebido,
//     valorTotalPendente,
//     tickets: allTickets,
//   });
// };

// const getTicketById = async (req, res) => {
//   const ticket = await Ticket.findById(req.params.id)
//     .populate("baseOmie")
//     .populate("arquivos")
//     .populate("documentosFiscais")
//     .populate("prestador")
//     .populate("servicos");

//   if (!ticket) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Ticket não encontrado",
//     });
//   }

//   sendResponse({
//     res,
//     statusCode: 200,
//     ticket,
//   });
// };

// const deleteTicket = async (req, res) => {
//   const ticket = await Ticket.findByIdAndDelete(req.params.id);

//   if (!ticket) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Ticket não encontrado",
//     });
//   }

//   sendResponse({
//     res,
//     statusCode: 200,
//     ticket,
//   });
// };

// const listFilesFromTicket = async (req, res) => {
//   const { id } = req.params;
//   const arquivos = await Arquivo.find({ ticket: id });
//   sendResponse({
//     res,
//     statusCode: 200,
//     arquivos,
//   });
// };

const removerArquivo = async (req, res) => {
  const arquivo = await ServicoTomadoTicketService.removerArquivo({
    arquivoId: req.params.id,
    ticketId: req.params.ticketId,
  });

  sendResponse({
    res,
    statusCode: 200,
    arquivo,
  });
};

const anexarArquivos = async (req, res) => {
  const arquivos = await ServicoTomadoTicketService.adicionarArquivo({
    arquivos: req.files,
    id: req.params.id,
  });

  sendResponse({
    res,
    statusCode: 201,
    arquivos,
  });
};

const getArchivedTickets = async (req, res) => {
  const {
    ["prestador.nome"]: nome,
    ["prestador.tipo"]: tipo,
    ["prestador.documento"]: documento,
    searchTerm = "",
    pageIndex,
    pageSize,
    ...rest
  } = req.query;

  const { page, limite, tickets, totalDeTickets } =
    await ServicoTomadoTicketService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: tickets,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeTickets / limite),
      totalItems: totalDeTickets,
      itemsPerPage: limite,
    },
  });
};

// const getTicketsPago = async (req, res) => {
//   const {
//     ["prestador.nome"]: nome,
//     ["prestador.tipo"]: tipo,
//     ["prestador.documento"]: documento,
//     status,
//     searchTerm = "",
//     sortBy,
//     pageIndex,
//     pageSize,
//     ...rest
//   } = req.query;

//   const prestadorFiltersQuery = filterUtils.queryFiltros({
//     filtros: {
//       nome: nome,
//       tipo: tipo,
//       documento: documento,
//     },
//     schema: Prestador.schema,
//   });

//   const prestadoresQuerySearchTerm = filterUtils.querySearchTerm({
//     schema: Prestador.schema,
//     searchTerm,
//     camposBusca: ["nome", "tipo", "documento"],
//   });

//   const prestadoresIds = await Prestador.find({
//     $and: [prestadorFiltersQuery, { $or: [prestadoresQuerySearchTerm] }],
//   }).select("_id");

//   const prestadorConditions =
//     prestadoresIds.length > 0
//       ? [{ prestador: { $in: prestadoresIds.map((e) => e._id) } }]
//       : [];

//   const filtersQuery = filterUtils.queryFiltros({
//     filtros: rest,
//     schema: Ticket.schema,
//   });

//   const searchTermCondition = filterUtils.querySearchTerm({
//     searchTerm,
//     schema: Ticket.schema,
//     camposBusca: ["titulo", "createdAt"],
//   });

//   const queryResult = {
//     $and: [
//       {
//         status: "concluido",
//         etapa: "concluido",
//       },
//       { ...filtersQuery, status: "concluido", etapa: "concluido" },
//       { $or: [searchTermCondition, ...prestadorConditions] },
//     ],
//   };

//   let sorting = {};

//   if (sortBy) {
//     const [campo, direcao] = sortBy.split(".");
//     const campoFormatado = campo.replaceAll("_", ".");
//     sorting[campoFormatado] = direcao === "desc" ? -1 : 1;
//   }

//   const page = parseInt(pageIndex) || 0;
//   const limite = parseInt(pageSize) || 10;
//   const skip = page * limite;

//   const [tickets, totalDeTickets] = await Promise.all([
//     Ticket.find(queryResult)
//       .populate("prestador", "nome documento")
//       .populate("arquivos", "nomeOriginal size mimetype tipo")
//       .populate({
//         path: "servicos",
//         options: { virtuals: true },
//       })
//       .skip(skip)
//       .limit(limite)
//       .sort(sorting),
//     Ticket.countDocuments(queryResult),
//   ]);

//   sendPaginatedResponse({
//     res,
//     statusCode: 200,
//     results: tickets,
//     pagination: {
//       currentPage: page,
//       totalPages: Math.ceil(totalDeTickets / limite),
//       totalItems: totalDeTickets,
//       itemsPerPage: limite,
//     },
//   });
// };

const adicionarServico = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.adicionarServico({
    servicoId: req.params.servicoId,
    ticketId: req.params.ticketId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    ticket,
  });
};

const removerServico = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.removerServico({
    servicoId: req.params.servicoId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    ticket,
  });
};

const addDocumentoFiscal = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.adicionarDocumentoFiscal({
    documentoFiscalId: req.params.documentoFiscalId,
    ticketId: req.params.ticketId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    ticket,
  });
};

const removeDocumentoFiscal = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.removerDocumentoFiscal({
    documentoFiscalId: req?.params?.documentoFiscalId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    ticket,
  });
};

const excluir = async (req, res) => {
  const ticket = await ServicoTomadoTicketService.excluir({
    id: req.params.id,
  });

  return sendResponse({
    res,
    statusCode: 200,
    ticket,
  });
};

module.exports = {
  excluir,
  aprovar,
  reprovar,
  obterTicket,
  updateTicket,
  createTicket,
  getAllTickets,
  getArchivedTickets,
  adicionarServico,
  removerServico,
  anexarArquivos,
  removerArquivo,
  addDocumentoFiscal,
  removeDocumentoFiscal,
};
