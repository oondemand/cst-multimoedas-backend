const cloneConfigSection = (section = {}) => ({
  ...section,
});

const defaultConfig = {
  controleAlteracao: {},
  integracao: {},
  lista: {},
};

let modelConfig = {
  controleAlteracao: {},
  integracao: {},
  lista: {},
};

const updateConfigSection = (sectionName, data = {}) => {
  if (!data || typeof data !== "object") {
    return;
  }

  modelConfig = {
    ...modelConfig,
    [sectionName]: {
      ...modelConfig[sectionName],
      ...data,
    },
  };
};

const configureModelEnums = ({
  controleAlteracao,
  integracao,
  lista,
} = {}) => {
  updateConfigSection("controleAlteracao", cloneConfigSection(controleAlteracao));
  updateConfigSection("integracao", cloneConfigSection(integracao));
  updateConfigSection("lista", cloneConfigSection(lista));
};

const getModelConfig = () => modelConfig;

const resetModelConfig = () => {
  modelConfig = {
    controleAlteracao: cloneConfigSection(defaultConfig.controleAlteracao),
    integracao: cloneConfigSection(defaultConfig.integracao),
    lista: cloneConfigSection(defaultConfig.lista),
  };
};

module.exports = {
  configureModelEnums,
  getModelConfig,
  resetModelConfig,
};
