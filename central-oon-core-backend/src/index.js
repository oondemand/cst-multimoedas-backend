const dotenv = require('dotenv');
dotenv.config();

const createApp = require('./boot/createApp');
const createServer = require('./boot/createServer');
const logger = require('./config/logger');
const { uploadExcel, uploadPDF } = require('./config/multer');
const createHttpClient = require('./config/httpClient');
const GenericError = require('./errors/GenericError');
const authMiddleware = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const logMiddleware = require('./middlewares/logMiddleware');
const registrarAcaoMiddleware = require('./middlewares/registrarAcaoMiddleware');
const Log = require('./models/Log');
const ControleAlteracao = require('./models/ControleAlteracao');
const Importacao = require('./models/Importacao');
const Lista = require('./models/Lista');
const Etapa = require('./models/Etapa');
const Usuario = require('./models/Usuario');
const Sistema = require('./models/Sistema');
const Moeda = require('./models/Moeda');
const { usuarioController, sistemaController, moedaController } = require('./controllers');
const { usuarioRouter, sistemaRouter, moedaRouter, authRouter } = require('./routers');
const ControleAlteracaoService = require('./services/controleAlteracao');
const ImportacaoService = require('./services/importacao');
const ListaService = require('./services/lista');
const EtapaService = require('./services/etapa');
const UsuarioService = require('./services/usuario');
const SistemaService = require('./services/sistema');
const MoedaService = require('./services/moeda');
const { registrarAcao } = require('./services/controleService');
const { sendErrorResponse } = require('./utils/response');
const helpers = require('./utils/helpers');
const excel = require('./utils/excel');
const fileHandler = require('./utils/fileHandler');
const pagination = require('./utils/pagination');
const filters = require('./utils/pagination/filter');
const email = require('./utils/email');

module.exports = {
  createApp,
  createServer,
  logger,
  uploadExcel,
  uploadPDF,
  createHttpClient,
  GenericError,
  authMiddleware,
  errorMiddleware,
    logMiddleware,
    registrarAcaoMiddleware,
    registrarAcao,
    Log,
    ControleAlteracao,
    Importacao,
    Lista,
    Etapa,
    Usuario,
    Sistema,
    Moeda,
    ControleAlteracaoService,
    ImportacaoService,
    ListaService,
    EtapaService,
    UsuarioService,
    SistemaService,
    MoedaService,
    usuarioController,
    sistemaController,
    moedaController,
    usuarioRouter,
    sistemaRouter,
    moedaRouter,
    authRouter,
    sendErrorResponse,
    helpers,
    excel,
    fileHandler,
    pagination,
    filters,
    email,
};
