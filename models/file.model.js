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
        send_by: {
            type: Sequelize.STRING
        },
        sender_name: {
            type: Sequelize.STRING
        },
        sender_email: {
            type: Sequelize.STRING
        },
        sender_phone: {
            type: Sequelize.STRING
        },
        receiver_name: {
            type: Sequelize.STRING
        },
        receiver_contact: {
            type: Sequelize.STRING
        },
        receiver_contact_type: {
            type: Sequelize.STRING
        }
    });

    return File;
};