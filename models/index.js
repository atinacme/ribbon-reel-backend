const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    // dialectOptions: {
    //     ssl: {
    //         require: dbConfig.dialectOptions.ssl.require,
    //         rejectUnauthorized: dbConfig.dialectOptions.ssl.rejectUnauthorized
    //     }
    // },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.onboardings = require("./onboarding.model.js")(sequelize, Sequelize);
db.files = require("./file.model.js")(sequelize, Sequelize);
db.orders = require("./orders.model.js")(sequelize, Sequelize);

module.exports = db;