// const Prestador = require("../../models/Prestador");
// const Ticket = require("../../models/Ticket");
// const Arquivo = require("../../models/Arquivo");
// const Servico = require("../../models/Servico");
// const Etapa = require("../../models/Etapa");

const DocumentoCadastralService = require("../../services/documentoCadastral");
const DocumentoCadastralExcel = require("../../services/documentoCadastral/excel");
const {
  ImportacaoService,
  excel: { arrayToExcelBuffer },
  helpers: {
    sendPaginatedResponse,
    sendResponse,
    // sendErrorResponse,
  },
} = require("central-oon-core-backend");

// const DocumentoCadastral = require("../../models/DocumentoCadastral");

// const filtersUtils = require("../../utils/filter");
// const { criarNomePersonalizado } = require("../../utils/formatters");

// const { registrarAcao } = require("central-oon-core-backend");
// const {
//   ACOES,
//   ENTIDADES,
//   ORIGENS,
// } = require("../../constants/controleAlteracao");


const criar = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.criar({
    documentoCadastral: req.body,
  });

  sendResponse({
    res,
    statusCode: 201,
    documentoCadastral,
  });
};

// const criarDocumentoCadastralPorUsuarioPrestador = async (req, res) => {
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

//   const novoDocumentoCadastral = new DocumentoCadastral({
//     ...filteredBody,
//     prestador: prestador._id,
//     arquivo: novoArquivo._id,
//   });

//   await novoDocumentoCadastral.save();

//   return sendResponse({
//     res,
//     statusCode: 201,
//     documentoCadastral: novoDocumentoCadastral,
//   });
// };

const atualizar = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.atualizar({
    id: req.params.id,
    documentoCadastral: req.body,
  });

  return sendResponse({
    res,
    statusCode: 200,
    documentoCadastral,
  });
};

const listar = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;
  const { documentosCadastrais, limite, totalDeDocumentosCadastrais, page } =
    await DocumentoCadastralService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: documentosCadastrais,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeDocumentosCadastrais / limite),
      totalItems: totalDeDocumentosCadastrais,
      itemsPerPage: limite,
    },
  });
};

const listarPorPessoa = async (req, res) => {
  const { pessoaId } = req.params;

  const documentosCadastrais = await DocumentoCadastralService.listarPorPessoa({
    pessoaId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    documentosCadastrais,
  });
};

// const listarDocumentoCadastralPorUsuarioPrestador = async (req, res) => {
//   try {
//     const prestador = await Prestador.findOne({
//       usuario: req.usuario,
//     });

//     const documentosCadastrais = await DocumentoCadastral.find({
//       prestador: prestador,
//     }).populate("prestador", "sid nome documento");

//     return sendResponse({
//       res,
//       statusCode: 200,
//       documentosCadastrais,
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
  const documentoCadastral = await DocumentoCadastralService.excluir({
    id: req.params.id,
  });

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoCadastral,
  });
};

const anexarArquivo = async (req, res) => {
  const arquivo = await DocumentoCadastralService.anexarArquivo({
    arquivo: req.file,
    id: req.params.documentoCadastralId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    arquivo,
  });
};

const removerArquivo = async (req, res) => {
  const arquivo = await DocumentoCadastralService.removerArquivo({
    id: req.params.documentoCadastralId,
    arquivoId: req.params.id,
  });

  return sendResponse({
    res,
    statusCode: 200,
    arquivo,
  });
};

const aprovarDocumento = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.atualizar({
    id: req.params.id,
    documentoCadastral: { statusValidacao: "aprovado" },
  });

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoCadastral,
  });
};

const reprovarDocumento = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.atualizar({
    id: req.params.id,
    documentoCadastral: { ...req.body, statusValidacao: "recusado" },
  });

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoCadastral,
  });
};

const exportar = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;

  const { json } = await DocumentoCadastralExcel.exportar({
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
    tipo: "documento-cadastral",
  });

  sendResponse({
    res,
    statusCode: 200,
    importacao,
  });

  const { arquivoDeErro, detalhes } = await DocumentoCadastralExcel.importar({
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
