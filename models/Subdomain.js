const {Model, DataTypes} = require("sequelize")
const database = require("../database")

const Subdomain = database.define("subdomain", {
    subdomain: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pointedTo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recordType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: "subdomain",
    tableName: "subdomains",
    timestamps: false
})

Subdomain.sync()

module.exports = Subdomain;