const DocumentoFiscal = require("../../models/DocumentoFiscal");
const FiltersUtils = require("../../../packages/central-oon-core-backend/src/utils/pagination/filter");
const PaginationUtils = require("../../../packages/central-oon-core-backend/src/utils/pagination");
const Arquivo = require("../../models/Arquivo");
const { criarNomePersonalizado } = require("../../../packages/central-oon-core-backend/src/utils/formatters");
const ArquivoNaoEncontradoError = require("../errors/arquivo/arquivoNaoEncontradoError");
const DocumentoFiscalNaoEncontradaError = require("../errors/documentoFiscal/documentoFiscalNaoEncontradaError");
const EtapaService = require("../etapa");
const ServicoTomadoTicket = require("../../models/ServicoTomadoTicket");
const Servico = require("../../models/Servico");
const { default: mongoose } = require("mongoose");

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
  ).populate("pessoa");
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
      .populate("arquivo"),
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
  const servicos = await DocumentoFiscal.find({
    statusValidacao: "aprovado",
    statusPagamento: "aberto",
    pessoa: pessoaId,
  }).populate("pessoa", "nome documento");

  return servicos;
};

const aprovar = async ({ id, servicos, criarTicket }) => {
  const documentoFiscal = await atualizar({
    documentoFiscal: { statusValidacao: "aprovado" },
    id,
  });

  const etapas = await EtapaService.listarEtapasAtivasPorEsteira({
    esteira: "servicos-tomados",
  });

  if (criarTicket) {
    await Servico.updateMany(
      { _id: { $in: servicos.map((e) => new mongoose.Types.ObjectId(e)) } },
      { statusProcessamento: "processando" }
    );

    await ServicoTomadoTicket.create({
      titulo: `Comissão ${documentoFiscal.pessoa.nome} - ${documentoFiscal.pessoa?.documento}`,
      servicos,
      documentosFiscais: [documentoFiscal._id],
      pessoa: documentoFiscal.pessoa._id,
      etapa: etapas[0].codigo,
    });
  }

  return documentoFiscal;
};

module.exports = {
  criar,
  aprovar,
  excluir,
  atualizar,
  buscarPorId,
  anexarArquivo,
  removerArquivo,
  listarPorPessoa,
  listarComPaginacao,
};
