require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    HOST: isProduction ? process.env.PG_HOST : "localhost",
    USER: isProduction ? process.env.PG_USER : "postgres",
    PASSWORD: isProduction ? process.env.PG_PASSWORD : "12345",
    DB: isProduction ? process.env.PG_DATABASE : "postgres",
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: false,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};