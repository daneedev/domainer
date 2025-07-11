import db from '../database';
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare isAdmin: boolean;
    declare role: string;
    declare subdomainsCount: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'user'
    },
    subdomainsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }

}, {
    tableName: 'users',
    sequelize: db,
});

User.sync()

export default User;