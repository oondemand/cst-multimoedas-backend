const PessoaSync = require('../pessoa/omie');
const ContaPagarSync = require('../contaPagar/omie');
const ArquivosSync = require('../arquivo/omie');

module.exports = {
  pessoa: {
    omie_central: PessoaSync.omieCentral.queue.start,
    central_omie: PessoaSync.centralOmie.queue.start,
  },
  conta_pagar: {
    omie_central: ContaPagarSync.omieCentral.queue.start,
    central_omie: ContaPagarSync.centralOmie.queue.start,
  },
  anexos: {
    central_omie: ArquivosSync.centralOmie.queue.start,
  },
};
