const {
  helpers: Helpers,
  integracaoConstants: { ETAPAS_DEFAULT },
} = require("central-oon-core-backend");

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
      await integracao.save();
      await onError?.(integracao, error);
    }

    if (result) {
      integracao.etapa = ETAPAS_DEFAULT.sucesso.codigo;
      integracao.resposta = result;
      await integracao.save();
      await onSuccess?.(integracao, result);
    }
  } catch (error) {
    console.log("Erro ao fazer integracao", error);
    integracao.etapa = ETAPAS_DEFAULT.erro.codigo;
    integracao.erros = [...integracao.erros, error?.message ?? error];
    await integracao.save();
    onError?.(integracao, error);
  }
};

module.exports = {
  processarIntegracao,
};
