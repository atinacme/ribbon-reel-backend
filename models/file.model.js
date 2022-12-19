module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("files", {
        order_id: {
            type: Sequelize.BIGINT
        },
        filename: {
            type: Sequelize.STRING
        },
        filepath: {
            type: Sequelize.STRING
        },
        reel_status: {
            type: Sequelize.STRING,
            defaultValue: 'pending'
        }
    });

    return File;
};