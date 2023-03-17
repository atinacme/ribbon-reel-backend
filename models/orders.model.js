module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
        store_name: {
            type: Sequelize.STRING
        },
        store_owner: {
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
        order_id: {
            type: Sequelize.BIGINT
        },
        order_number: {
            type: Sequelize.INTEGER
        },
        date: {
            type: Sequelize.STRING
        },
        receiver_name: {
            type: Sequelize.STRING
        },
        receiver_contact: {
            type: Sequelize.STRING
        },
        total: {
            type: Sequelize.STRING
        },
        reel_revenue: {
            type: Sequelize.STRING
        },
        shipping_status: {
            type: Sequelize.STRING
        },
        reel_status: {
            type: Sequelize.STRING,
            defaultValue: 'pending'
        },
        items: {
            type: Sequelize.STRING
        }
    });

    return Order;
};