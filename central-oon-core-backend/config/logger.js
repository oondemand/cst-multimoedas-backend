const fs = require("node:fs");
const path = require("node:path");
const winston = require("winston");

const DEFAULT_LOG_DIR = path.join(process.cwd(), "logs");

const ensureDirectoryExists = (directory) => {
  if (!directory) {
    return;
  }

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const createDefaultFileTransports = ({ logDir = DEFAULT_LOG_DIR } = {}) => {
  ensureDirectoryExists(logDir);

  return [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
    }),
  ];
};

const createLogger = ({
  level = "info",
  logDir = DEFAULT_LOG_DIR,
  transports = [],
  enableDefaultFileTransports = true,
  enableConsole = process.env.NODE_ENV !== "production",
  consoleTransportOptions = {},
  format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
} = {}) => {
  const resolvedTransports = [...transports];

  if (enableDefaultFileTransports) {
    resolvedTransports.push(...createDefaultFileTransports({ logDir }));
  }

  if (enableConsole) {
    const defaultConsoleOptions = {
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    };

    resolvedTransports.push(
      new winston.transports.Console({
        ...defaultConsoleOptions,
        ...consoleTransportOptions,
      }),
    );
  }

  return winston.createLogger({
    level,
    format,
    transports: resolvedTransports,
  });
};

const logger = createLogger();

module.exports = {
  createLogger,
  logger,
};
