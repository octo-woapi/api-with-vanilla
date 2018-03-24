const bunyan = require("bunyan");

module.exports = ({ appname, logLevel }) => {
  return bunyan.createLogger({ name: appname, level: logLevel });
};
