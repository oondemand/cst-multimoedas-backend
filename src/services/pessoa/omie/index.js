const ClienteService = require("../../omie/clienteService");
const BaseOmie = require("../../../models/BaseOmie");
const GenericError = require("../../errors/generic");
const { mapExporter } = require("./mapImporter");
const Pessoa = require("../../../models/Pessoa");

const importarDoOmie = async ({ event, appKey }) => {
  const baseOmie = await BaseOmie.findOne({
    appKey,
    status: "ativo",
  });

  if (!baseOmie) throw new GenericError("Base omie não encontrada", 404);

  const caracteristicas = await ClienteService.consultarCaracteristicas({
    appKey: baseOmie.appKey,
    appSecret: baseOmie.appSecret,
    codigo_cliente_omie: event?.codigo_cliente_omie,
  });

  const pessoaObj = mapExporter({
    event,
    caracteristicas,
  });

  const pessoa = await Pessoa.findOneAndUpdate(
    {
      $and: [
        {
          $or: [
            { codigo_cliente_omie: pessoaObj?.codigo_cliente_omie },
            { documento: pessoaObj?.documento },
          ],
          status: { $nin: ["arquivado" || "inativo"] },
        },
      ],
    },
    pessoaObj,
    { new: true }
  );

  await pessoa.save();
};

module.exports = { importarDoOmie };
