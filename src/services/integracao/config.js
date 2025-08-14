const IntegracaoConfig = require("../../models/IntegracaoConfig");
const GenericError = require("../errors/generic");

const listar = async () => {
  return await IntegracaoConfig.find();
};

const atualizar = async ({ id, config }) => {
  const configAtualizada = await IntegracaoConfig.findByIdAndUpdate(
    id,
    { ...config },
    { new: true }
  );

  if (!configAtualizada)
    return new GenericError("Configuração não encontrada!", 404);

  return configAtualizada;
};

module.exports = {
  listar,
  atualizar,
};
