const mongoose = require('mongoose');

const SistemaBase = require('../central-oon-core-backend').Sistema;
const templateSchema = SistemaBase.schema.clone();

module.exports = mongoose.model('TemplateConfig', templateSchema);
