const {Model, DataTypes} = require("sequelize")
const database = require("../database")

const User = database.define("user", {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subdomainsCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: "user",
    tableName: "users",
    timestamps: false
})

User.sync()

module.exports = User;