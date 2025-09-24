# Arquitetura do CST Multimoedas Backend

## Sumário
- [Visão geral](#visão-geral)
- [Ciclo de inicialização e infraestrutura compartilhada](#ciclo-de-inicialização-e-infraestrutura-compartilhada)
  - [Bootstrap do servidor](#bootstrap-do-servidor)
  - [Infraestrutura central reutilizável](#infraestrutura-central-reutilizável)
  - [Configuração de banco de dados, logger e upload](#configuração-de-banco-de-dados-logger-e-upload)
- [Camada HTTP e roteamento](#camada-http-e-roteamento)
  - [Rotas públicas e privadas](#rotas-públicas-e-privadas)
  - [Middlewares transversais](#middlewares-transversais)
- [Domínios de negócio](#domínios-de-negócio)
  - [Pessoas](#pessoas)
  - [Serviços](#serviços)
  - [Tickets de serviços tomados](#tickets-de-serviços-tomados)
  - [Documentos fiscais e cadastrais](#documentos-fiscais-e-cadastrais)
  - [Planejamento operacional](#planejamento-operacional)
  - [Integrações e sincronizações](#integrações-e-sincronizações)
  - [Dashboards e métricas](#dashboards-e-métricas)
- [Fluxos assíncronos, importação/exportação e arquivos](#fluxos-assíncronos-importaçãoexportação-e-arquivos)
- [Utilidades e serviços de apoio](#utilidades-e-serviços-de-apoio)
- [Seeds e configuração inicial](#seeds-e-configuração-inicial)
- [Guia para criação de novos módulos](#guia-para-criação-de-novos-módulos)
  - [Passo a passo](#passo-a-passo)
  - [Exemplo orientador](#exemplo-orientador)
- [Pontos de atenção e próximos passos](#pontos-de-atenção-e-próximos-passos)

## Visão geral
O backend é um serviço Node.js baseado em Express que utiliza um núcleo compartilhado (pasta `central-oon-core-backend`) para padronizar inicialização, middlewares, utilidades e integrações. O aplicativo específico do CST Multimoedas sobrepõe-se a esse núcleo registrando rotas e regras de negócio próprias em `src/`.

## Ciclo de inicialização e infraestrutura compartilhada

### Bootstrap do servidor
- `src/server.js` importa `startServer` do núcleo e injeta a aplicação Express criada em `src/app.js`, delegando ao núcleo a responsabilidade por conexão com banco de dados, logs e binding da porta.
- `src/app.js` invoca `createApp` do núcleo, registrando rotas públicas (webhooks) e privadas (contextos de negócio), mantendo a responsabilidade de montagem de routers específicos do domínio.

### Infraestrutura central reutilizável
- `central-oon-core-backend/index.js` exporta `createApp`, `startServer`, middlewares, configurações e utilidades, permitindo que módulos da aplicação acessem a infraestrutura compartilhada.
- `central-oon-core-backend/app.js` constrói a instância Express com CORS, Helmet, parsing de JSON/URL encoded, swagger embutido (`/docs`), rotas de autenticação e seed, e registra middlewares globais de autenticação, log e tratamento de erros.
- `central-oon-core-backend/server.js` encapsula a rotina de boot, garantindo que uma função de conexão com banco seja fornecida, resolvendo porta/nome do serviço e iniciando o listener apenas após conexão bem-sucedida ao MongoDB.

### Configuração de banco de dados, logger e upload
- `central-oon-core-backend/config/db.js` constrói a URI do MongoDB a partir de variáveis de ambiente, normaliza parâmetros como TLS, replica set, e expõe `connectDB` e fábricas de conexão customizáveis.
- `central-oon-core-backend/config/logger.js` cria um logger Winston com transporte para arquivos (`logs/error.log`, `logs/info.log`) e console (ambientes não produtivos).
- `central-oon-core-backend/config/multer.js` oferece fábricas de upload (Excel, PDF/imagem) reutilizadas por diversos routers de importação.

## Camada HTTP e roteamento

### Rotas públicas e privadas
- Rotas públicas: `src/routers/webhookRouter.js` registra webhooks de pessoa e contas a pagar vindos do Omie.
- Rotas privadas: `src/app.js` monta routers para pessoas, serviços, tickets, documentos, planejamento, dashboard e listas Omie. Rotas herdadas do núcleo incluem autenticação, ativação, controle de acesso, importações, listas e configurações diversas.

### Middlewares transversais
- `central-oon-core-backend/middlewares/authMiddleware.js` autentica chamadas via token do serviço "Meus Apps", injeta o usuário no request e bloqueia requisições não autenticadas.
- `central-oon-core-backend/middlewares/logMiddleware.js` registra logs de requisições mutativas na coleção `Log` (`src/models/Log.js`).
- `central-oon-core-backend/middlewares/errorMiddleware.js` padroniza respostas de erro, tratando especificamente erros Multer e exceções de domínio (`GenericError`).
- `central-oon-core-backend/middlewares/registrarAcaoMiddleware.js` intercepta respostas, captura payloads e registra auditorias via `src/services/controleService.js`, utilizando as constantes `ENTIDADES`, `ACOES` e `ORIGENS` de `src/constants/controleAlteracao.js`.

## Domínios de negócio

### Pessoas
- **Router**: `src/routers/pessoaRouter.js` expõe CRUD, exportação e importação via upload Excel.
- **Controller**: `src/controllers/pessoa/index.js` orquestra serviços, manipula paginação e retorno em buffers Excel, usando `ImportacaoService` para rastrear lotes.
- **Service**: `src/services/pessoa/index.js` aplica regras (sincronização Omie, filtros/paginação, busca por documento, exclusão lógica). Cada criação/atualização agenda tarefa em `src/services/pessoa/omie` para integrar com Omie.
- **Modelo**: `src/models/Pessoa/index.js` define subdocumentos para pessoa física/jurídica, normaliza país via `LISTA_PAISES_OMIE` e mantém status de sincronização.

### Serviços
- **Router**: `src/routers/servicoRouter.js` expõe CRUD, importação/exportação Excel e listagem por pessoa.
- **Controller**: `src/controllers/servico/index.js` adiciona cotação atual ao retornar serviços, trabalha com importações e exportações similares às de pessoa.
- **Service**: `src/services/servico/index.js` implementa filtros compostos envolvendo dados de pessoa (`buscarIdsPessoasFiltrados`), agrega valores por status, controla status de processamento e cotação.
- **Modelo**: `src/models/Servico.js` relaciona serviços a pessoa e moeda, acompanha status (`ativo/inativo/arquivado`) e status de processamento.

### Tickets de serviços tomados
- **Router**: `src/routers/servicoTomadoTicketRouter.js` cobre criação, upload de anexos, adição/remoção de serviços/documentos fiscais, aprovação/reprovação e arquivamento.
- **Controller**: `src/controllers/servicoTomadoTicket/index.js` compõe respostas com cotação atual de serviços, delega ações ao serviço e integra com `ServicoService` para atualizar valores.
- **Service**: `src/services/servicoTomadoTicket/index.js` orquestra lifecycle do ticket (etapas iniciais vindas de `EtapaService`), gerencia anexos (`Arquivo`), relaciona documentos fiscais, controla status e oferece agregações por etapa/status para dashboards.
- **Modelo**: `src/models/ServicoTomadoTicket.js` guarda referências a pessoa, serviços, documentos fiscais, arquivos e conta a pagar Omie, mantendo `status` e `etapa` com timestamps.

### Documentos fiscais e cadastrais
- **Routers**: `src/routers/documentoFiscalRouter.js` e `src/routers/documentoCadastralRouter.js` fornecem CRUD, import/export, anexos e fluxos de aprovação.
- **Controllers**: `src/controllers/documentoFiscal/index.js` e o homólogo de documento cadastral coordenam importação com `ImportacaoService`, criam tickets quando documentos são aprovados, e respondem com buffers Excel para exportação.
- **Services**: `src/services/documentoFiscal/index.js` (e equivalentes) manipulam anexos, populam relações, aprovam documentos (criando tickets e movendo serviços para "processando" quando necessário) e utilizam utilidades como `criarNomePersonalizado` e `FiltersUtils`.
- **Modelos**: `src/models/DocumentoFiscal.js` define tipo customizado `CompetenciaType`, estados de validação/pagamento; `src/models/DocumentoCadastral.js` mantém status e referências ao arquivo e pessoa.

### Planejamento operacional
- **Router**: `src/routers/planejamentoRouter.js` expõe listagem de serviços, estatísticas, processamento em massa e sincronização de esteira.
- **Controller**: `src/controllers/planejamento/index.js` reutiliza `ServicoService` para enriquecer retornos e coordena chamadas a `PlanejamentoService`.
- **Service**: `src/services/planejamento/index.js` gera filtros/paginação, agrega estatísticas considerando cotação efetiva, atualiza status de múltiplos serviços registrando ações e sincroniza tickets (criando-os se inexistentes).

### Integrações e sincronizações
- **Router herdado**: `central-oon-core-backend/app.js` registra `/integracao` com rotas para listar, arquivar, reprocessar e processar.
- **Controller**: `src/controllers/integracao/index.js` dispara filas de sincronização para pessoa, contas a pagar e anexos, com base em configurações (`IntegracaoConfigService`).
- **Service**: `src/services/integracao/index.js` cuida de paginação, arquivamento (desfazendo efeitos colaterais como vínculo de conta a pagar), reprocessamento e agregação por direção/tipo para dashboards.
- **Modelo**: `src/models/Integracao.js` rastreia tarefas, payloads, tentativas, erros e status de arquivamento.
- **Fila**: `src/services/queue/index.js` implementa worker genérico; `src/services/queue/defaultHandler.js` define rotina padrão (`processarIntegracao`) gerenciando tentativas, mudança de etapa (`ETAPAS_DEFAULT`) e callbacks de sucesso/erro.
- **Sync Omie**: módulos em `src/services/pessoa/omie` e `src/services/contaPagar/omie` utilizam a fila, mapeiam payloads e chamam serviços Omie; webhooks em `src/routers/webhookRouter.js` agendam sincronizações ao receber eventos externos.

### Dashboards e métricas
- **Router**: `src/routers/dashboardRouter.js` expõe `/estatisticas`.
- **Controller**: `src/controllers/dashboard/index.js` combina dados de `ServicoService`, `ServicoTomadoTicketService` e `IntegracaoService`, retornando agregações para frontend.

## Fluxos assíncronos, importação/exportação e arquivos
- **Importação**: `src/services/importacao/index.js` cria registros em `Importacao` com buffers originais/logs/erros para auditoria; controllers de pessoa/serviço/documentos preenchem estes campos após processamento.
- **Excel utilitário**: `central-oon-core-backend/utils/excel.js` converte planilhas para JSON e gera buffers para download; usado em controladores de exportação e em logs de importação.
- **Uploads**: `central-oon-core-backend/config/multer.js` fornece instâncias prontas para Excel e PDF/imagem, reutilizadas nos routers de documentos.
- **Arquivos**: `src/models/Arquivo.js` armazena metadados/buffer; `ServicoTomadoTicketService` e `DocumentoFiscalService` criam/removem instâncias conforme anexos são manipulados.

## Utilidades e serviços de apoio
- **Integração Omie**: `src/config/apiOmie.js` cria cliente Axios com timeout e cabeçalhos padrão.
- **Envio de e-mail**: `src/utils/emailUtils.js` usa SendGrid, lendo credenciais de `Sistema` (`src/models/Sistema.js`) e oferecendo funções para teste e notificação de erro de integração.
- **Datas**: `src/utils/dateUtils.js` formata datas no padrão Omie.
- **Busca de características**: `src/utils/caracteristicas.js` possui helper para localizar características em arrays (ver observação na seção de pontos de atenção).
- **Constantes**: `src/constants/*` concentra enums para controle de alteração, integrações e listas; reutilizadas por middlewares e serviços.

## Seeds e configuração inicial
- `src/routers/seedRouter.js` executa ativação inicial: cria Base Omie, assistentes, etapas, sistema (incluindo chaves Omie e SendGrid), listas Omie, moedas e configurações de integração a partir de arquivos em `src/seeds/`.

## Guia para criação de novos módulos

### Passo a passo
1. **Modelagem**: defina um schema Mongoose em `src/models`, seguindo padrões de timestamps e enums para status. Inclua referências (ObjectId) quando necessário.
2. **Serviço**: crie um módulo em `src/services/<domínio>` encapsulando regras de negócio, utilizando `FiltersUtils` e `PaginationUtils` para listagens e `GenericError` para exceções específicas.
3. **Controller**: adicione controlador em `src/controllers/<domínio>` que converta requisições em chamadas ao serviço e utilize `sendResponse`/`sendPaginatedResponse` do núcleo.
4. **Router**: registre rotas em `src/routers/<domínio>Router.js`, usando `asyncHandler` para capturar erros e `registrarAcaoMiddleware` quando for necessário auditar alterações.
5. **Registro na aplicação**: importe o novo router em `src/app.js` (privado) ou no núcleo (`central-oon-core-backend/app.js`) se for funcionalidade compartilhada.
6. **Auditoria**: escolha a combinação correta de `ENTIDADES` e `ACOES` no router para garantir rastreabilidade em `ControleAlteracao`.
7. **Integração com filas** (opcional): se o módulo gerar tarefas assíncronas, aproveite `src/services/queue` e `src/services/queue/defaultHandler.js` para criar workers consistentes.
8. **Importação/Exportação** (opcional): use `ImportacaoService` e utilidades de Excel para oferecer carga em massa consistente com outros módulos.

### Exemplo orientador
O fluxo de criação de pessoas ilustra o padrão completo:
```javascript
// src/routers/pessoaRouter.js
router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.PESSOA,
  }),
  asyncHandler(PessoaController.criar)
);
```
```javascript
// src/controllers/pessoa/index.js
const criar = async (req, res) => {
  const pessoa = await PessoaService.criar({ pessoa: req.body });
  sendResponse({ res, statusCode: 201, pessoa });
};
```
```javascript
// src/services/pessoa/index.js
const criar = async ({ pessoa }) => {
  const pessoaNova = await PessoaBusiness.criar({ pessoa });
  sync.centralOmie.addTask({ pessoa: pessoaNova });
  return pessoaNova;
};
```
Esse arranjo demonstra como roteadores aplicam middlewares de auditoria, controllers mantêm respostas consistentes e serviços encapsulam lógica adicional (ex.: acionar fila de integração).

## Pontos de atenção e próximos passos
- Revisar `src/utils/caracteristicas.js`, pois a condição `if (!caracteristicas || campo) return;` interrompe a busca mesmo quando `campo` está definido — provavelmente deveria ser `!campo`.
- Garantir que novos módulos reutilizem constantes e helpers existentes para manter auditoria, paginação e tratamento de erros uniformes.
- Atualizar documentação conforme novas integrações ou domínios forem adicionados.
