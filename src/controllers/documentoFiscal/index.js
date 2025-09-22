// -----------------------------------------------------------------------------------------------
// const Prestador = require("../../models/Prestador");
// const Ticket = require("../../models/Ticket");
// const Arquivo = require("../../models/Arquivo");
// const Servico = require("../../models/Servico");
// const Etapa = require("../../models/Etapa");

const DocumentoFiscalService = require("../../services/documentoFiscal");
const EtapaService = require("../../services/etapa");

const DocumentoFiscalExcel = require("../../services/documentoFiscal/excel");
const { arrayToExcelBuffer } = require("../../../packages/central-oon-core-backend/src/utils/excel");
const ImportacaoService = require("../../services/importacao");

// const DocumentoFidocumentoFiscal = require("../../models/DocumentoFidocumentoFiscal");

// const filtersUtils = require("../../../packages/central-oon-core-backend/src/utils/filter");
// const { criarNomePersonalizado } = require("../../../packages/central-oon-core-backend/src/utils/formatters");

// const { registrarAcao } = require("../../services/controleService");
// const {
//   ACOES,
//   ENTIDADES,
//   ORIGENS,
// } = require("../../constants/controleAlteracao");

const {
  sendPaginatedResponse,
  sendResponse,
  // sendErrorResponse,
} = require("../../../packages/central-oon-core-backend/src/utils/helpers");
const ServicoTomadoTicket = require("../../models/ServicoTomadoTicket");

const criar = async (req, res) => {
  const documentoFiscal = await DocumentoFiscalService.criar({
    documentoFiscal: req.body,
  });

  sendResponse({
    res,
    statusCode: 201,
    documentoFiscal,
  });
};

// const criarDocumentoFidocumentoFiscalPorUsuarioPrestador = async (req, res) => {
//   const usuario = req.usuario;
//   const arquivo = req.file;

//   if (!arquivo) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Arquivo é um campo obrigatório",
//     });
//   }

//   const prestador = await Prestador.findOne({
//     usuario: usuario._id,
//   });

//   if (!prestador) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Prestador não encontrado",
//     });
//   }

//   const filteredBody = Object.fromEntries(
//     Object.entries(req.body).filter(([_, value]) => value !== "")
//   );

//   const novoArquivo = new Arquivo({
//     nome: criarNomePersonalizado({ nomeOriginal: arquivo.originalname }),
//     nomeOriginal: arquivo.originalname,
//     mimetype: arquivo.mimetype,
//     size: arquivo.size,
//     buffer: arquivo.buffer,
//     tipo: "documento-cadastral",
//   });

//   await novoArquivo.save();

//   const novoDocumentoFidocumentoFiscal = new DocumentoFidocumentoFiscal({
//     ...filteredBody,
//     prestador: prestador._id,
//     arquivo: novoArquivo._id,
//   });

//   await novoDocumentoFidocumentoFiscal.save();

//   return sendResponse({
//     res,
//     statusCode: 201,
//     documentoFiscal: novoDocumentoFidocumentoFiscal,
//   });
// };

const atualizar = async (req, res) => {
  const documentoFiscal = await DocumentoFiscalService.atualizar({
    id: req.params.id,
    documentoFiscal: req.body,
  });

  return sendResponse({
    res,
    statusCode: 200,
    documentoFiscal,
  });
};

const listar = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;
  const { documentosFiscais, limite, totalDeDocumentosFiscais, page } =
    await DocumentoFiscalService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: documentosFiscais,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeDocumentosFiscais / limite),
      totalItems: totalDeDocumentosFiscais,
      itemsPerPage: limite,
    },
  });
};

const listarPorPessoa = async (req, res) => {
  const { pessoaId } = req.params;

  const documentosFiscais = await DocumentoFiscalService.listarPorPessoa({
    pessoaId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    documentosFiscais,
  });
};

// const listarDocumentoFidocumentoFiscalPorUsuarioPrestador = async (req, res) => {
//   try {
//     const prestador = await Prestador.findOne({
//       usuario: req.usuario,
//     });

//     const documentosFiscais = await DocumentoFidocumentoFiscal.find({
//       prestador: prestador,
//     }).populate("prestador", "sid nome documento");

//     return sendResponse({
//       res,
//       statusCode: 200,
//       documentosFiscais,
//     });
//   } catch (error) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Erro ao buscar documentos cadastrais",
//       error: error.message,
//     });
//   }
// };

const excluir = async (req, res) => {
  const documentoFiscal = await DocumentoFiscalService.excluir({
    id: req.params.id,
  });

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoFiscal,
  });
};

const anexarArquivo = async (req, res) => {
  const arquivo = await DocumentoFiscalService.anexarArquivo({
    arquivo: req.file,
    id: req.params.documentoFiscalId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    arquivo,
  });
};

const removerArquivo = async (req, res) => {
  const arquivo = await DocumentoFiscalService.removerArquivo({
    id: req.params.documentoFiscalId,
    arquivoId: req.params.id,
  });

  return sendResponse({
    res,
    statusCode: 200,
    arquivo,
  });
};

const aprovarDocumento = async (req, res) => {
  const documentoFiscal = await DocumentoFiscalService.aprovar({
    id: req.params.id,
    servicos: req.body?.servicos ?? [],
    criarTicket: req.body?.ticket,
  });

  // const documentoFiscal = await DocumentoFiscalService.atualizar({
  //   id: req.params.id,
  //   documentoFiscal: { statusValidacao: "aprovado" },
  // });

  // const etapas = await EtapaService.listarEtapasAtivasPorEsteira({
  //   esteira: "servicos-tomados",
  // });

  // if (req.body.ticket) {
  //   await ServicoTomadoTicket.create({
  //     titulo: `Comissão ${documentoFiscal.pessoa.nome} - ${documentoFiscal.pessoa?.documento}`,
  //     servicos: req.body?.servicos ?? [],
  //     documentosFiscais: [documentoFiscal._id],
  //     pessoa: documentoFiscal.pessoa._id,
  //     etapa: etapas[0].codigo,
  //   });
  // }

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoFiscal,
  });
};

const reprovarDocumento = async (req, res) => {
  const documentoFiscal = await DocumentoFiscalService.atualizar({
    id: req.params.id,
    documentoFiscal: { ...req.body, statusValidacao: "recusado" },
  });

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoFiscal,
  });
};

const exportar = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { json } = await DocumentoFiscalExcel.exportar({
    filtros: rest,
    pageIndex,
    pageSize,
    searchTerm,
  });

  const buffer = arrayToExcelBuffer({ array: json, title: "exported" });

  sendResponse({
    res,
    statusCode: 200,
    buffer,
  });
};

const importar = async (req, res) => {
  const importacao = await ImportacaoService.criar({
    arquivo: req.files[0],
    tipo: "documento-fiscal",
  });

  sendResponse({
    res,
    statusCode: 200,
    importacao,
  });

  const { arquivoDeErro, detalhes } = await DocumentoFiscalExcel.importar({
    arquivo: req.files[0],
    usuario: req.usuario,
  });

  importacao.arquivoErro = arrayToExcelBuffer({
    array: arquivoDeErro,
    title: "errors",
  });

  importacao.arquivoLog = Buffer.from(detalhes.errors);
  importacao.detalhes = detalhes;

  await importacao.save();
};

module.exports = {
  criar,
  listar,
  excluir,
  importar,
  exportar,
  atualizar,
  anexarArquivo,
  removerArquivo,
  listarPorPessoa,
  aprovarDocumento,
  reprovarDocumento,
};
