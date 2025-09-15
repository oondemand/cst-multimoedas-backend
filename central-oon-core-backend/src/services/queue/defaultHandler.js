const Helpers = require('../../utils/helpers');

const DEFAULT_ETAPAS = {
  requisicao: { nome: 'Requisicao', codigo: 'requisicao' },
  reprocessar: { nome: 'Reprocessar', codigo: 'reprocessar' },
  processando: { nome: 'Processando', codigo: 'processando' },
  erro: { nome: 'Falha', codigo: 'falha' },
  sucesso: { nome: 'Sucesso', codigo: 'sucesso' },
};

const getEtapaCodigo = (etapas, etapa) =>
  etapas?.[etapa]?.codigo ?? DEFAULT_ETAPAS[etapa].codigo;

const processarIntegracao = async ({
  integracao,
  onSuccess,
  onError,
  executor,
  etapas = DEFAULT_ETAPAS,
}) => {
  if (!integracao || integracao.arquivado) return;

  try {
    integracao.executadoEm = new Date();
    integracao.tentativas = (integracao.tentativas ?? 0) + 1;
    await integracao.save();

    const [result, error] = await Helpers.attempt(() => executor(integracao));

    if (error) {
      integracao.erros = [
        ...(integracao.erros ?? []),
        error?.response?.data ?? error?.message,
      ];
      integracao.etapa =
        integracao.tentativas > 3
          ? getEtapaCodigo(etapas, 'erro')
          : getEtapaCodigo(etapas, 'reprocessar');
      await integracao.save();
      await onError?.(integracao, error);
    }

    if (result) {
      integracao.etapa = getEtapaCodigo(etapas, 'sucesso');
      integracao.resposta = result;
      await integracao.save();
      await onSuccess?.(integracao, result);
    }
  } catch (error) {
    console.log('Erro ao fazer integracao', error);
    integracao.etapa = getEtapaCodigo(etapas, 'erro');
    integracao.erros = [...(integracao.erros ?? []), error?.message ?? error];
    await integracao.save();
    await onError?.(integracao, error);
  }
};

module.exports = {
  processarIntegracao,
  DEFAULT_ETAPAS,
};
