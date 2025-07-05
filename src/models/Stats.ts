import db from '../database';
import { Model, DataTypes } from 'sequelize';

class Stats extends Model {
    declare id: number;
    declare allSubdomains: number;
    declare approvedSubdomains: number;
    declare declinedSubdomains: number;
    declare pendingReviewSubdomains: number;
    declare totalUsers: number;
    declare totalRoles: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

}

Stats.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
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
    tableName: 'stats',
    sequelize: db,
});

Stats.sync()

export default Stats;