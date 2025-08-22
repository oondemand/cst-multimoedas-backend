const DocumentoCadastral = require("../../models/DocumentoCadastral");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const Arquivo = require("../../models/Arquivo");
const { criarNomePersonalizado } = require("../../utils/formatters");
const ArquivoNaoEncontradoError = require("../errors/arquivo/arquivoNaoEncontradoError");

const criar = async ({ documentoCadastral }) => {
  const novoDocumentoCadastral = new DocumentoCadastral(documentoCadastral);
  await novoDocumentoCadastral.save();
  return novoDocumentoCadastral;
};

const atualizar = async ({ id, documentoCadastral }) => {
  const documentoCadastralAtualizada =
    await DocumentoCadastral.findByIdAndUpdate(id, documentoCadastral, {
      new: true,
    });
  if (!documentoCadastralAtualizada)
    return new DocumentoCadastralNaoEncontradaError();
  return documentoCadastralAtualizada;
};

const buscarPorId = async ({ id }) => {
  const documentoCadastral = await DocumentoCadastral.findById(id);
  if (!documentoCadastral || !id)
    throw new DocumentoCadastralNaoEncontradaError();
  return documentoCadastral;
};

const excluir = async ({ id }) => {
  const documentoCadastral = await DocumentoCadastral.findById(id);

  if (!documentoCadastral || !id)
    throw new DocumentoCadastralNaoEncontradaError();

  documentoCadastral.status = "arquivado";
  return await documentoCadastral.save();
};

const listarComPaginacao = async ({
  filtros,
  searchTerm,
  pageIndex,
  pageSize,
}) => {
  const query = FiltersUtils.buildQuery({
    filtros,
    schema: DocumentoCadastral.schema,
    searchTerm,
    camposBusca: [],
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [documentosCadastrais, totalDeDocumentosCadastrais] = await Promise.all(
    [
      DocumentoCadastral.find({
        $and: [...query, { status: { $ne: "arquivado" } }],
      })
        .skip(skip)
        .limit(limite)
        .populate("pessoa")
        .populate("arquivo"),
      DocumentoCadastral.countDocuments({
        $and: [...query, { status: { $ne: "arquivado" } }],
      }),
    ]
  );

  return { documentosCadastrais, totalDeDocumentosCadastrais, page, limite };
};

const anexarArquivo = async ({ arquivo, id }) => {
  const documentoCadastral = await DocumentoCadastral.findById(id);

  const novoArquivo = new Arquivo({
    nome: criarNomePersonalizado({ nomeOriginal: arquivo.originalname }),
    nomeOriginal: arquivo.originalname,
    mimetype: arquivo.mimetype,
    size: arquivo.size,
    buffer: arquivo.buffer,
    tipo: "documento-cadastral",
  });

  await novoArquivo?.save();

  documentoCadastral.arquivo = novoArquivo._id;
  await documentoCadastral.save();

  return novoArquivo;
};

const removerArquivo = async ({ id, arquivoId }) => {
  const arquivo = await Arquivo.findByIdAndDelete(arquivoId);
  if (!arquivo || !arquivoId) throw new ArquivoNaoEncontradoError();

  await DocumentoCadastral.findByIdAndUpdate(id, {
    $unset: { arquivo: arquivoId },
  });

  return arquivo;
};

const listarPorPessoa = async ({ pessoaId }) => {
  const documentosCadastrais = await DocumentoCadastral.find({
    pessoa: pessoaId,
    status: { $ne: "arquivado" },
  }).populate("arquivo");

  return documentosCadastrais;
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
