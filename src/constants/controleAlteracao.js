const ENTIDADES = {
  PESSOA: "pessoa",
  SERVICO: "servico",
  INTEGRACAO: "integracao",
  DOCUMENTO_FISCAL: "documento-fiscal",
  DOCUMENTO_CADASTRAL: "documento-cadastral",
  SERVICO_TOMADO_TICKET: "servico-tomado.ticket",
  CONFIGURACAO_USUARIO: "configuracao.usuario",
  CONFIGURACAO_SISTEMA: "configuracao.sistema",
  CONFIGURACAO_SISTEMA_APP_PRESTADOR: "configuracao.sistema.app-prestador",
  CONFIGURACAO_ASSISTENTE: "configuracao.assistente",
  CONFIGURACAO_ETAPA: "configuracao.etapa",
  CONFIGURACAO_LISTA: "configuracao.lista",
  CONFIGURACAO_LISTA_CAMPANHA: "configuracao.lista.campanha",
  CONFIGURACAO_LISTA_GRUPO: "configuracao.lista.grupo",
  CONFIGURACAO_LISTA_TIPO_DOCUMENTO_CADASTRAL:
    "configuracao.lista.tipo-documento-cadastral",
  CONFIGURACAO_LISTA_TIPO_DOCUMENTO_FISCAL:
    "configuracao.lista.tipo-documento-fiscal",
  CONFIGURACAO_LISTA_MOTIVO_RECUSA: "configuracao.lista.motivo-recusa",
  CONFIGURACAO_LISTA_OMIE: "configuracao.lista.omie",
  CONFIGURACAO_LISTA_TIPO_SERVICO_TOMADO:
    "configuracao.lista.tipo-servico-tomado",
};

const ACOES = {
  ADICIONADO: "adicionado",
  ALTERADO: "alterado",
  EXCLUIDO: "excluido",
  CONVITE_ENVIADO: "convite-enviado",
  APROVADO: "aprovado",
  REPROVADO: "reprovado",
  ARQUIVADO: "arquivado",
  PAGO: "pago",
  PAGAMENTO_EXCLUIDO: "pagamento-excluido",
  RECUPERAR_SENHA: "recuperar-senha",
};

const ORIGENS = {
  FORM: "form",
  DATAGRID: "datagrid",
  IMPORTACAO: "importacao",
  OMIE: "omie",
  APP_PRESTADOR: "app-prestador",
  APROVACAO_DOCUMENTO_CADASTRAL: "aprovacao-documento-cadastral",
  APROVACAO_DOCUMENTO_FISCAL: "aprovacao-documento-fiscal",
  PLANEJAMENTO: "planejamento",
  ESTEIRA: "esteira",
  API: "api",
  ENVIO_CONVITE: "envio-convite",
};

module.exports = {
  ENTIDADES,
  ACOES,
  ORIGENS,
};
