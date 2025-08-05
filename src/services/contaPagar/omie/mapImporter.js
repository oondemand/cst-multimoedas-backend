const { LISTA_PAISES_OMIE } = require("../../../constants/omie/paises");
const Pessoa = require("../../../models/Pessoa");

const mapExporter = ({ event, caracteristicas }) => {
  // const pessoa = {};

  // EVENT: {
  //   bairro: '',
  //   bloqueado: 'N',
  //   bloquear_faturamento: '',
  //   cep: '',
  //   cidade: '',
  //   cnae: '',
  //   cnpj_cpf: '',
  //   codigo_cliente_integracao: '6838aa1259ad925dd7a528fc',
  //   codigo_cliente_omie: 5152335537,
  //   codigo_pais: '1058',
  //   complemento: '',
  //   contato: '',
  //   contribuinte: '',
  //   dadosBancarios: {
  //     agencia: '',
  //     codigo_banco: '',
  //     conta_corrente: '',
  //     doc_titular: '',
  //     nome_titular: 'Flávio Araujo'
  //   },
  //   email: 'flavioaraujo44@email.com',
  //   endereco: '',
  //   endereco_numero: '',
  //   estado: 'EX',
  //   exterior: 'S',
  //   fax_ddd: '',
  //   fax_numero: '',
  //   homepage: '',
  //   inativo: 'N',
  //   inscricao_estadual: '',
  //   inscricao_municipal: '',
  //   inscricao_suframa: '',
  //   logradouro: '',
  //   nif: '1',
  //   nome_fantasia: 'Flávio Araujo',
  //   obs_detalhadas: '',
  //   observacao: '',
  //   optante_simples_nacional: '',
  //   pessoa_fisica: 'N',
  //   produtor_rural: '',
  //   razao_social: 'Flávio Araujo',
  //   recomendacao_atraso: '',
  //   recomendacoes: {
  //     codigo_vendedor: 0,
  //     email_fatura: '',
  //     gerar_boletos: 'N',
  //     numero_parcelas: ''
  //   },
  //   tags: [],
  //   telefone1_ddd: '',
  //   telefone1_numero: '',
  //   telefone2_ddd: '',
  //   telefone2_numero: '',
  //   tipo_atividade: '',
  //   valor_limite_credito: '0.00'
  // }

  const pais = LISTA_PAISES_OMIE.find((e) => e.cCodigo === event?.codigo_pais);
  // const rg = caracteristicas?.find((e) => {});

  const pessoa = {
    codigo_cliente_omie: event.codigo_cliente_omie,
    documento: event.cnpj_cpf,
    // grupo: , // caracteristicas.grupo
    nome: event.razao_social,
    pessoaFisica: {
      // rg: , // caracteristicas
      // apelido //caracteristicas
      // dataNascimento: // caracteristicas
    },
    pessoaJuridica: {
      nomeFantasia: event.nome_fantasia,
      // regimeTributario: ,
    },
    endereco: {
      pais: {
        codigo: pais?.cCodigo,
        nome: pais?.cDescricao,
        sigla: pais?.cCodigoISO,
      },
    },
  };

  return pessoa;
};

module.exports = {
  mapExporter,
};
