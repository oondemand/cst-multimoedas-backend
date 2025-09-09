const sgMail = require("@sendgrid/mail");
const { format } = require("date-fns");
const { Sistema } = require("central-oon-core-backend");
const { conviteTemplate } = require("../constants/template");

const enviarEmail = async (emailTo, assunto, corpo, anexos = []) => {
  const config = await Sistema.findOne();
  sgMail.setApiKey(config?.appKey_sendgrid);
  const remetenteEmail = config?.remetente?.email;
  const remetenteNome = config?.remetente?.nome ?? remetenteEmail;

  const message = {
    from: {
      email: remetenteEmail,
      name: remetenteNome,
    },
    personalizations: [
      {
        to: [
          {
            email: emailTo.email,
            name: emailTo.nome,
          },
        ],
        subject: assunto,
      },
    ],
    content: [
      {
        type: "text/html",
        value: corpo,
      },
    ],
    attachments: anexos.map(({ filename, fileBuffer }) => ({
      content: fileBuffer.toString("base64"),
      filename: filename,
      disposition: "attachment",
    })),
  };

  try {
    const retorno = await sgMail.send(message);
    return retorno;
  } catch (error) {
    throw new Error("Erro ao enviar e-mail");
  }
};

const emailEsqueciMinhaSenha = async ({ usuario, url }) => {
  try {
    const emailTo = {
      email: usuario.email,
      nome: usuario.nome,
    };

    const assunto = "Recuperação de senha";

    const corpo = `<h1>Olá, ${usuario.nome}!</h1>
    <p>Clique no link abaixo darmos inicio ao processo de recuperação de senha:</p>
    <a href="${url}">Recuperar minha senha</a>`;

    await enviarEmail(emailTo, assunto, corpo);
  } catch (error) {
    throw new Error("Erro ao enviar e-mail para recuperação de senha");
  }
};

const emailImportarRpas = async ({ usuario, detalhes }) => {
  try {
    const emailTo = {
      email: usuario.email,
      nome: usuario.nome,
    };

    const assunto = "RPAs importadas";

    const corpo = `<h1>Olá, ${usuario.nome}!</h1>
    <p>Foram importados ${detalhes.sucesso} arquivos.</p>
    <p>Arquivos com erro ${detalhes.erros.quantidade} arquivos.</p>
    ${detalhes.erros.quantidade > 0 ? "<p>Segue em anexo o log de erros</p>" : ""}
    `;

    if (detalhes.erros.quantidade > 0) {
      const arquivoDeErros = Buffer.from(detalhes.erros.logs).toString(
        "base64",
      );
      const anexos = [
        {
          filename: `logs-de-erro-raps-${format(new Date(), "dd-MM-yyy")}.txt`,
          fileBuffer: arquivoDeErros,
        },
      ];

      return await enviarEmail(emailTo, assunto, corpo, anexos);
    }

    return await enviarEmail(emailTo, assunto, corpo);
  } catch (error) {
    throw new Error("Erro ao enviar e-mail de serviços exportados:");
  }
};

const emailErroIntegracaoOmie = async ({ usuario, error }) => {
  try {
    const emailTo = {
      email: usuario.email,
      nome: usuario.nome,
    };

    const assunto = "Erro integração com omie";

    const corpo = `<h1>Olá, ${usuario.nome}!</h1>
    <p>Ouve um erro na integração com o omie.</p>
    <p>Detalhes do erro: ${error}</p>`;

    await enviarEmail(emailTo, assunto, corpo);
  } catch (error) {
    throw new Error("Erro ao enviar e-mail para erro integração omie");
  }
};

const emailLinkCadastroUsuarioPrestador = async ({ email, nome, url }) => {
  try {
    const emailTo = {
      email,
      nome,
    };

    const assunto = "Acesso Liberado";

    const corpo = await conviteTemplate({ url });

    return await enviarEmail(emailTo, assunto, corpo);
  } catch (error) {
    throw error;
  }
};

const emailTeste = async ({ email }) => {
  try {
    const emailTo = {
      email: email,
      nome: email,
    };

    const assunto = "Teste envio de email";
    const corpo = `Se voce recebeu esse email o envio de email esta funcionando corretamente!`;

    return await enviarEmail(emailTo, assunto, corpo);
  } catch (error) {
    throw new Error(
      "Erro ao enviar e-mail para detalhes de importação de prestadores",
    );
  }
};

module.exports = {
  emailTeste,
  emailEsqueciMinhaSenha,
  emailImportarRpas,
  emailErroIntegracaoOmie,
  emailLinkCadastroUsuarioPrestador,
};
