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
        notifications: {
            type: Sequelize.STRING
        }
    });

    return Onboarding;
};