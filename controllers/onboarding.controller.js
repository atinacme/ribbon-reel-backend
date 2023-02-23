const db = require("../models");
const Onboarding = db.onboardings;
const Op = db.Sequelize.Op;

// Create and Save a new Onboarding
exports.create = (req, res) => {
    // Validate request
    if (!req.body.merchant_name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Onboarding
    const onboarding = {
        merchant_name: req.body.merchant_name,
        store_name: req.body.store_name,
        account_email: req.body.account_email,
        layout: req.body.layout,
        subscription_plan: req.body.subscription_plan
    };

    // Save Onboarding in the database
    Onboarding.create(onboarding)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Onboarding."
            });
        });
};

// Retrieve all Onboardings from the database.
exports.findAll = (req, res) => {
    const store_name = req.query.store_name;
    var condition = store_name ? { store_name: { [Op.iLike]: `%${store_name}%` } } : null;

    Onboarding.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving onboardings."
            });
        });
};

// Update a Onboarding by the store_name in the request
exports.update = (req, res) => {
    const store_name = req.params.store_name;
    Onboarding.update(req.body, {
        where: { store_name: store_name }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Onboarding was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Onboarding with store_name=${store_name}. Maybe Onboarding was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Onboarding with store_name=" + store_name
            });
        });
};