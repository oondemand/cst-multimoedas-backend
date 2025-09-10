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
const Integracao = require('./models/Integracao');
const IntegracaoConfig = require('./models/IntegracaoConfig');
const controleAlteracaoController = require('./controllers/controleAlteracao');
const importacaoController = require('./controllers/importacao');
const listaController = require('./controllers/lista');
const integracaoController = require('./controllers/integracao');
const controleAlteracaoRouter = require('./routers/controleAlteracaoRouter');
const importacaoRouter = require('./routers/importacaoRouter');
const listaRouter = require('./routers/listaRouter');
const integracaoRouter = require('./routers/integracaoRouter');
const ControleAlteracaoService = require('./services/controleAlteracao');
const ImportacaoService = require('./services/importacao');
const ListaService = require('./services/lista');
const IntegracaoService = require('./services/integracao');
const IntegracaoConfigService = require('./services/integracao/config');
const integracaoConstants = require('./constants/integracao');
const { registrarAcao } = require('./services/controleService');
const { sendErrorResponse } = require('./utils/response');
const helpers = require('./utils/helpers');
const excel = require('./utils/excel');
const fileHandler = require('./utils/fileHandler');
const pagination = require('./utils/pagination');
const filters = require('./utils/pagination/filter');

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
    Integracao,
    IntegracaoConfig,
    controleAlteracaoController,
    importacaoController,
    listaController,
    integracaoController,
    ControleAlteracaoService,
    ImportacaoService,
    ListaService,
    IntegracaoService,
    IntegracaoConfigService,
    controleAlteracaoRouter,
    importacaoRouter,
    listaRouter,
    integracaoRouter,
    integracaoConstants,
    sendErrorResponse,
    helpers,
    excel,
    fileHandler,
    pagination,
    filters,
};
