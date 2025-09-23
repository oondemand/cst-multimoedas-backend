const createArquivoModel = require("./Arquivo");
const createAssistenteModel = require("./Assistente");
const createControleAlteracaoModel = require("./ControleAlteracao");
const createEtapaModel = require("./Etapa");
const createImportacaoModel = require("./Importacao");
const createIntegracaoModel = require("./Integracao");
const createIntegracaoConfigModel = require("./IntegracaoConfig");
const createListaModel = require("./Lista");
const createLogModel = require("./Log");
const createMoedaModel = require("./Moeda");
const createSistemaModel = require("./Sistema");
const createUsuarioModel = require("./Usuario");
const {
  configureModelEnums,
  getModelConfig,
  resetModelConfig,
} = require("./config");

let cachedModels;

const buildModels = (config) => ({
  Arquivo: createArquivoModel(config),
  Assistente: createAssistenteModel(config),
  ControleAlteracao: createControleAlteracaoModel(config),
  Etapa: createEtapaModel(config),
  Importacao: createImportacaoModel(config),
  Integracao: createIntegracaoModel(config),
  IntegracaoConfig: createIntegracaoConfigModel(config),
  Lista: createListaModel(config),
  Log: createLogModel(config),
  Moeda: createMoedaModel(config),
  Sistema: createSistemaModel(config),
  Usuario: createUsuarioModel(config),
});

const getModels = () => {
  if (!cachedModels) {
    cachedModels = buildModels(getModelConfig());
  }

  return cachedModels;
};

const modelsProxy = new Proxy(
  {},
  {
    get(_, prop) {
      const models = getModels();
      return models[prop];
    },
    ownKeys() {
      return Reflect.ownKeys(getModels());
    },
    getOwnPropertyDescriptor(_, prop) {
      const value = getModels()[prop];
      if (value === undefined) {
        return undefined;
      }

      return {
        value,
        enumerable: true,
        configurable: true,
      };
    },
  },
);

const configureModels = (config = {}) => {
  configureModelEnums(config);
  cachedModels = undefined;
};

const resetModels = () => {
  resetModelConfig();
  cachedModels = undefined;
};

module.exports = {
  models: modelsProxy,
  configureModels,
  resetModels,
};
