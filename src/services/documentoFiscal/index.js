const DocumentoFiscal = require("../../models/DocumentoFiscal");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const Arquivo = require("../../models/Arquivo");
const { criarNomePersonalizado } = require("../../utils/formatters");
const ArquivoNaoEncontradoError = require("../errors/arquivo/arquivoNaoEncontradoError");
const DocumentoFiscalNaoEncontradaError = require("../errors/documentoFiscal/documentoFiscalNaoEncontradaError");

const criar = async ({ documentoFiscal }) => {
  const novoDocumentoFiscal = new DocumentoFiscal(documentoFiscal);
  await novoDocumentoFiscal.save();
  return novoDocumentoFiscal;
};

const atualizar = async ({ id, documentoFiscal }) => {
  const documentoFiscalAtualizada = await DocumentoFiscal.findByIdAndUpdate(
    id,
    documentoFiscal,
    { new: true }
  );
  if (!documentoFiscalAtualizada)
    return new DocumentoFiscalNaoEncontradaError();
  return documentoFiscalAtualizada;
};

const buscarPorId = async ({ id }) => {
  const documentoFiscal = await DocumentoFiscal.findById(id);
  if (!documentoFiscal || !id) throw new DocumentoFiscalNaoEncontradaError();
  return documentoFiscal;
};

const excluir = async ({ id }) => {
  const documentoFiscal = await DocumentoFiscal.findById(id);

  if (!documentoFiscal || !id) throw new DocumentoFiscalNaoEncontradaError();

  documentoFiscal.status = "arquivado";
  return await documentoFiscal.save();
};

const listarComPaginacao = async ({
  filtros,
  searchTerm,
  pageIndex,
  pageSize,
}) => {
  const query = FiltersUtils.buildQuery({
    filtros,
    schema: DocumentoFiscal.schema,
    searchTerm,
    camposBusca: [],
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [documentosFiscais, totalDeDocumentosFiscais] = await Promise.all([
    DocumentoFiscal.find({
      $and: [...query, { status: { $ne: "arquivado" } }],
    })
      .skip(skip)
      .limit(limite)
      .populate("pessoa")
      .populate("arquivo", "nomeOriginal mimetype size"),
    DocumentoFiscal.countDocuments({
      $and: [...query, { status: { $ne: "arquivado" } }],
    }),
  ]);

  return { documentosFiscais, totalDeDocumentosFiscais, page, limite };
};

const anexarArquivo = async ({ arquivo, id }) => {
  const documentoFiscal = await DocumentoFiscal.findById(id);

  const novoArquivo = new Arquivo({
    nome: criarNomePersonalizado({ nomeOriginal: arquivo.originalname }),
    nomeOriginal: arquivo.originalname,
    mimetype: arquivo.mimetype,
    size: arquivo.size,
    buffer: arquivo.buffer,
    tipo: "documento-fiscal",
  });

  await novoArquivo?.save();

  documentoFiscal.arquivo = novoArquivo._id;
  await documentoFiscal.save();

  return novoArquivo;
};

const removerArquivo = async ({ id, arquivoId }) => {
  const arquivo = await Arquivo.findByIdAndDelete(arquivoId);
  if (!arquivo || !arquivoId) throw new ArquivoNaoEncontradoError();

  await DocumentoFiscal.findByIdAndUpdate(id, {
    $unset: { arquivo: arquivoId },
  });

  return arquivo;
};

const listarPorPessoa = async ({ pessoaId }) => {
  const documentosFiscais = await DocumentoFiscal.find({
    pessoa: pessoaId,
  }).populate("arquivo");

  return documentosFiscais;
};

module.exports = {
  criar,
  excluir,
  atualizar,
  buscarPorId,
  anexarArquivo,
  removerArquivo,
  listarPorPessoa,
  listarComPaginacao,
};
