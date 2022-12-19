module.exports = app => {
    const file = require("../controllers/file.controller");

    var router = require("express").Router();

    router.post("/upload", file.upload);

    router.post("/findFile", file.findFile);

    router.get("/files", file.getListFiles);

    router.get("/files/:name", file.download);

    app.use('/api/file', router);
};