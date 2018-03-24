const Sequelize = require("sequelize");

module.exports = conf => {
  let sequelize = undefined;
  if (conf.env === "production") {
    sequelize = new Sequelize(conf.db.uri);
  } else {
    sequelize = new Sequelize(
      conf.db.database,
      conf.db.username,
      conf.db.password,
      conf.db.sequelize
    );
  }

  return sequelize;
};
