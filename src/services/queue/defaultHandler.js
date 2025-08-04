const { ETAPAS_DEFAULT } = require("../../constants/integracao");
const Helpers = require("../../utils/helpers");

const processarIntegracao = async ({
  integracao,
  onSuccess,
  onError,
  executor,
}) => {
  if (!integracao || integracao.arquivado) return;

  try {
    integracao.executadoEm = new Date();
    integracao.tentativas = integracao.tentativas + 1;
    await integracao.save();

    const [result, error] = await Helpers.attempt(
      async () => await executor(integracao)
    );

    if (error) {
      integracao.erros = [
        ...integracao.erros,
        error?.response?.data ?? error?.message,
      ];
      integracao.tentativas > 3
        ? (integracao.etapa = ETAPAS_DEFAULT.erro.codigo)
        : (integracao.etapa = ETAPAS_DEFAULT.reprocessar.codigo);
      await onError?.(integracao, error);
    }

    if (result) {
      integracao.etapa = ETAPAS_DEFAULT.sucesso.codigo;
      integracao.resposta = result;
      await onSuccess?.(integracao, result);
    }

    console.log(error);

    await integracao.save();
  } catch (error) {
    console.log("Erro", error);
    integracao.etapa = ETAPAS_DEFAULT.erro.codigo;
    integracao.erros = [...integracao.erros, error?.message];
    onError?.(integracao, error);
    await integracao.save();
  }
};

module.exports = {
  processarIntegracao,
};
