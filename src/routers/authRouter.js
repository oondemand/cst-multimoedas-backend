const { authRouter } = require('central-oon-core-backend');
const Sistema = require('../models/Sistema');

const getOrigin = async () => (await Sistema.findOne())?.appKey;

module.exports = authRouter({ getOrigin });
