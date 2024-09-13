import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
    public id!: number;
    public email!: string;
    public name!: string;
    public password!: string;
    public stripeCustomerId?: string;
}

User.init(
    {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        },
        name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        },
        password: {
        type: DataTypes.STRING(50),
        allowNull: false,
        },
        stripeCustomerId: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'user',
    }
);

export default User;