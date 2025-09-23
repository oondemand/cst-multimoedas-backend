const { URLSearchParams } = require("node:url");
const mongoose = require("mongoose");

const { logger: defaultLogger } = require("./logger");

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no"].includes(normalized)) {
      return false;
    }
  }

  return undefined;
};

const buildMongoUri = ({
  server,
  name,
  authSource,
  replicaSet,
  tls,
  params = {},
} = {}) => {
  if (!server) {
    throw new Error("O servidor do MongoDB deve ser informado para montar a URI.");
  }

  if (!name) {
    throw new Error(
      "O nome do banco de dados do MongoDB deve ser informado para montar a URI.",
    );
  }

  const query = new URLSearchParams(params);

  if (authSource) {
    query.set("authSource", authSource);
  }

  const normalizedTls = normalizeBoolean(tls);

  if (typeof normalizedTls !== "undefined") {
    query.set("tls", String(normalizedTls));
  }

  if (replicaSet) {
    query.set("replicaSet", replicaSet);
  }

  const queryString = query.toString();

  return queryString ? `${server}/${name}?${queryString}` : `${server}/${name}`;
};

const createMongoConnection = ({
  server = process.env.DB_SERVER,
  user = process.env.DB_USER,
  password = process.env.DB_PASSWORD,
  name = process.env.DB_NAME,
  authSource = process.env.DB_AUTH_SOURCE,
  replicaSet = process.env.DB_REPLICA_SET,
  tls = process.env.DB_TSL,
  uri,
  params,
  mongooseOptions,
  logger = defaultLogger ?? console,
} = {}) => {
  const logInfo = (message) => {
    if (logger && typeof logger.info === "function") {
      logger.info(message);
    } else if (logger && typeof logger.log === "function") {
      logger.log(message);
    } else {
      console.log(message);
    }
  };

  const logError = (error, prefix = "") => {
    if (logger && typeof logger.error === "function") {
      logger.error(prefix, error);
    } else if (logger && typeof logger.log === "function") {
      logger.log(prefix, error);
    } else {
      console.error(prefix, error);
    }
  };

  const resolveMongoUri = () =>
    uri ??
    buildMongoUri({
      server,
      name,
      authSource,
      replicaSet,
      tls,
      params,
    });

  return async () => {
    try {
      const mongoUri = resolveMongoUri();

      await mongoose.connect(mongoUri, {
        user,
        pass: password,
        ...mongooseOptions,
      });

      logInfo(`Conectado ao MongoDB`);
      logInfo(` - Server: ${server}`);
      logInfo(` - User: ${user}`);
      logInfo(` - Database: ${name}`);
    } catch (error) {
      logError(error, `Erro ao conectar ao MongoDB ${name}`);
      throw error;
    }
  };
};

const connectDB = createMongoConnection();

module.exports = {
  buildMongoUri,
  createMongoConnection,
  connectDB,
};
