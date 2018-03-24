const pkg = require("../package");

module.exports = {
  appname: pkg.name,
  db: {
    username: "api_with_vanilla_javascript",
    password: "api_with_vanilla_javascript",
    database: "api_with_vanilla_javascript_test",
    sequelize: {
      dialect: "sqlite",
      operatorsAliases: false,
      logging: false,
      storage: "./data.db"
    }
  }
};
