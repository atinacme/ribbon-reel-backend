const uploadFile = require("../middleware/upload");
const db = require("../models");
const fs = require('fs');
const File = db.files;
const Op = db.Sequelize.Op;
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'atinacme1621@gmail.com',
        pass: 'tdfvnklfrpglmztk'
    }
});
const baseUrl = 'http://localhost:8080/api/file/files/';

const upload = async (req, res) => {
    try {
        console.log("req--->", req.body)
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        const file = {
            order_id: req.body.order_id,
            filename: req.file.originalname,
            filepath: req.file.path,
            sender_name: req.body.sender_name,
            receiver_name: req.body.receiver_name,
            receiver_email: req.body.receiver_email
        };
        File.create(file)
            .then(data => {
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                });
                const mailConfigurations = {
                    from: 'atinacme1621@gmail.com',
                    to: req.body.receiver_email,
                    subject: 'Gift Video Message',
                    text: `Hi! ${req.body.receiver_name}, ${req.body.sender_name} has send you a video message for the gift please click on the below link to view:
                    http://localhost:3001?order_id=${req.body.order_id}?receiver_name=${req.body.receiver_name}`
                };
            
                transporter.sendMail(mailConfigurations, function (error, info) {
                    if (error) throw Error(error);
                    res.send(info);
                });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Onboarding."
                });
            });
    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 20MB!",
            });
        }
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

// Retrieve all Files of Particular Order Number from the database.
const findFile = (req, res) => {
    const order_id = req.body.order_id;
    var condition = order_id ? { order_id: { [Op.iLike]: `%${order_id}%` } } : null;

    File.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving file."
            });
        });
};

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            });
        });

        res.status(200).send(fileInfos);
    });
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    findFile,
    getListFiles,
    download,
};