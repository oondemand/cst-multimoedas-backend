const Sistema = require('../../models/Sistema');
const email = require('../../utils/email');

const obterConfiguracao = async () => {
  return await Sistema.findOne();
};

const atualizar = async ({ id, data }) => {
  return await Sistema.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
};

const testeEmail = async ({ email: destinatario }) => {
  await email.emailTeste({ email: destinatario });
};

module.exports = {
  obterConfiguracao,
  atualizar,
  testeEmail,
};
