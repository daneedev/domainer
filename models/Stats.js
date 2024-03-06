const {Model, DataTypes} = require("sequelize")
const database = require("../database")

const stats = database.define("stats", {
    allSubdomains: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    approvedSubdomains: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    declinedSubdomains: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pendingReviewSubdomains: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalUsers: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalRoles: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: "stats",
    tableName: "stats",
    timestamps: false
})

stats.sync()

module.exports = stats;