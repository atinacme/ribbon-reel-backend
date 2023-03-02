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
        },
        sender_name: {
            type: Sequelize.STRING
        },
        receiver_name: {
            type: Sequelize.STRING
        },
        receiver_email: {
            type: Sequelize.STRING
        }
    });

    return File;
};