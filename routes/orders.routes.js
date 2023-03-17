module.exports = app => {
    const order = require("../controllers/orders.controller");

    var router = require("express").Router();

    router.post("/create", order.create);

    router.get("/findAll", order.findAll);

    router.get("/findAll", order.findAll);

    router.get("/findParticularOrder/:order_id", order.findParticularOrder);

    router.post("/mailAndMessage", order.mailAndMessage);

    app.use('/api/orders', router);
};