import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "mysql",
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        // Required for many cloud hosts like Railway
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false, 
            }
        },
        logging: process.env.NODE_ENV === "development"
            ? (sql: string) => console.log(`\n 🔍 SQL: ${sql}\n`) : false,

        define: {
            underscored: true,
            timestamps: true,
            freezeTableName: false,
        },
    }
);

export default sequelize;
