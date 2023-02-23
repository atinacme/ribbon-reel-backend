module.exports = (sequelize, Sequelize) => {
    const Onboarding = sequelize.define("onboardings", {
        merchant_name: {
            type: Sequelize.STRING
        },
        store_name: {
            type: Sequelize.STRING
        },
        account_email: {
            type: Sequelize.STRING
        },
        layout: {
            type: Sequelize.STRING
        },
        subscription_plan: {
            type: Sequelize.STRING
        },
        marketing_notifications: {
            type: Sequelize.STRING,
            defaultValue: true
        },
        order_notifications: {
            type: Sequelize.STRING,
            defaultValue: true
        },
        update_notifications: {
            type: Sequelize.STRING,
            defaultValue: false
        }
    });

    return Onboarding;
};