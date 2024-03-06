const {Model, DataTypes} = require("sequelize")
const database = require("../database")

const Role = database.define("role", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    maxSubdomains: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    default: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    modelName: "role",
    tableName: "roles",
    timestamps: false
})

Role.sync()

module.exports = Role;