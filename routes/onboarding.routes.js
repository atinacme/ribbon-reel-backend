module.exports = app => {
    const onboardings = require("../controllers/onboarding.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", onboardings.create);

    // Retrieve all Onboardings
    router.get("/", onboardings.findAll);

    // Update a Tutorial with id
    router.put("/:store_name", onboardings.update);

    app.use('/api/onboardings', router);
};