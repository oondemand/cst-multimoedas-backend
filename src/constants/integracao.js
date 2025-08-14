const ETAPAS_DEFAULT = {
  requisicao: { nome: "Requisicao", codigo: "requisicao" },
  reprocessar: { nome: "Reprocessar", codigo: "reprocessar" },
  processando: { nome: "Processando", codigo: "processando" },
  erro: { nome: "Falha", codigo: "falha" },
  sucesso: { nome: "Sucesso", codigo: "sucesso" },
};

const INTEGRACAO_TIPO = {
  PESSOA: "pessoa",
  CONTA_PAGAR: "conta_pagar",
  ANEXOS: "anexos",
};

const INTEGRACAO_DIRECAO = {
  CENTRAL_OMIE: "central_omie",
  OMIE_CENTRAL: "omie_central",
};

module.exports = {
  ETAPAS_DEFAULT,
  INTEGRACAO_TIPO,
  INTEGRACAO_DIRECAO,
};
