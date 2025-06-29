import db from '../database';
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

class Role extends Model {
    declare id: number;
    declare name: string;
    declare maxSubdomains: number;
    declare default: boolean;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

}

Role.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(128),
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
    tableName: 'roles',
    sequelize: db,
});

Role.sync()

export default Role;