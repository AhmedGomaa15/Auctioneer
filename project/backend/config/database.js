const Sequelize = require("sequelize");
const config = require("./config");

const conn = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

conn
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((error) => {
    console.log("Unable to connect to the database: ", error);
  });

module.exports = conn;
