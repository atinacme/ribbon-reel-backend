module.exports = app => {
    const file = require("../controllers/file.controller");

    var router = require("express").Router();

    router.post("/upload", file.upload);

    router.get("/findFile/:order_id/:send_by", file.findFile);

    router.get("/findFileGifter/:order_id", file.findFileGifter);

    router.get("/findFileReceipient/:order_id", file.findFileReceipient);

    router.get("/files", file.getListFiles);

    router.get("/files/:name", file.download);

    app.use('/api/file', router);
};