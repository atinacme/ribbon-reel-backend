module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
        store_name: {
            type: Sequelize.STRING
        },
        store_owner: {
            type: Sequelize.STRING
        },
        sender_email: {
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
        customer: {
            type: Sequelize.STRING
        },
        receiver_email: {
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