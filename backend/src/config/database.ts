import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE_NAME as string,
    process.env.DATABASE_USER as string,
    process.env.DATABASE_PASSWORD as string,
    {
        host: process.env.DATABASE_HOST,
        dialect: 'sqlite', 
        storage: './database.sqlite', 
        logging: true, 
    }
);

export default sequelize;