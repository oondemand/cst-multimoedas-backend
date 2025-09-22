const { startServer } = require("../central-oon-core-backend");
const app = require("./app");
const connectDB = require("./config/db");

startServer({ app, connectDB });
