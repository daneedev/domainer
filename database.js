const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("database", "user", "pass",{
    dialect: "sqlite",
    host: "./data/database.sqlite",
    logging: false
});

module.exports = sequelize;