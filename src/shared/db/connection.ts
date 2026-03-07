import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } from "../config/config.js";

export default class DB {
    private static instance: DB;
    private dbConnection: Sequelize;

    private constructor() {
        if (!DB_NAME || !DB_PASSWORD || !DB_USER || !DB_HOST)
            throw new Error("missing db_config");

        this.dbConnection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            dialect: "mysql",
            pool: {
                max: 10,
                min: 2,
                acquire: 30000,
                idle: 10000,
            }
        })
    }

    static getInstance(): DB {
        if (!this.instance) {
            this.instance = new DB();
        }
        return this.instance;
    }

    getConnection(): Sequelize {
        return this.dbConnection;
    }
}