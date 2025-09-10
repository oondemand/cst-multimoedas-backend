const Sistema = require("../../models/Sistema");
const { email } = require("central-oon-core-backend");

listarSistemaConfig = async (req, res) => {
  const sistema = await Sistema.findOne();

  if (!sistema) {
    return res
      .status(404)
      .json({ mensagem: "Nenhuma configuração encontrada." });
  }

  res.status(200).json(sistema);
};

atualizarSistemaConfig = async (req, res) => {
  const id = req.params.id;

  const sistemaAtualizado = await Sistema.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!sistemaAtualizado) {
    return res.status(404).json({ mensagem: "Configuração não encontrada." });
  }

  res.status(200).json(sistemaAtualizado);
};

testeEmail = async (req, res) => {
  await email.emailTeste({ email: req.body.email });
  res.status(200).json();
};

module.exports = {
  listarSistemaConfig,
  atualizarSistemaConfig,
  testeEmail,
};
