const path = require("path");
const env = process.env.NODE_ENV || "development";
const logLevel = process.env.LOG_LEVEL || "info";

module.exports = () => {
  return Object.assign(
    { env, logLevel },
    require(path.resolve(__dirname, env))
  );
};
