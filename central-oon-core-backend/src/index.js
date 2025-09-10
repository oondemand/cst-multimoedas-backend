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
const controleAlteracaoController = require('./controllers/controleAlteracao');
const controleAlteracaoRouter = require('./routers/controleAlteracaoRouter');
const ControleAlteracaoService = require('./services/controleAlteracao');
const { registrarAcao } = require('./services/controleService');
const { sendErrorResponse } = require('./utils/response');

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
    controleAlteracaoController,
    ControleAlteracaoService,
    controleAlteracaoRouter,
    sendErrorResponse,
};
