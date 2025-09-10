const ControleAlteracao = require('../models/ControleAlteracao');

async function registrarAcao({
  entidade,
  acao,
  origem,
  usuario,
  idRegistro,
  dadosAtualizados,
}) {
  try {
    const controleAlteracao = new ControleAlteracao({
      entidade,
      acao,
      origem,
      usuario,
      idRegistro,
      dadosAtualizados,
    });

    await controleAlteracao.save();
  } catch (e) {
    console.log('ERRO AO REGISTRAR ACAO', e);
  }
}

module.exports = { registrarAcao };
