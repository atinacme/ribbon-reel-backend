const uploadFile = require("../middleware/upload");
const db = require("../models");
const fs = require('fs');
const File = db.files;
const Op = db.Sequelize.Op;
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);
const parsePhoneNumber = require("libphonenumber-js/min")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);
const baseUrl = 'http://localhost:8080/api/file/files/';

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        const file = {
            order_id: req.body.order_id,
            filename: req.file.filename,
            filepath: req.file.path,
            send_by: req.body.send_by,
            sender_name: req.body.sender_name,
            sender_email: req.body.sender_email,
            sender_phone: req.body.sender_phone,
            receiver_name: req.body.receiver_name,
            receiver_contact: req.body.receiver_contact,
            receiver_contact_type: req.body.receiver_contact_type
        };
        File.create(file)
            .then(data => {
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.filename,
                });
                if (req.body.send_by === "gifter") {
                    if (req.body.receiver_contact_type === 'email') {
                        const msg = {
                            to: req.body.receiver_contact,
                            from: 'atinacme1621@gmail.com', // Use the email address or domain you verified above
                            subject: 'Gift Video Message',
                            text: `Hi! ${req.body.receiver_name}, ${req.body.sender_name} has send you a video message for the gift please click on the below link to view:
                        http://localhost:3001?${req.body.order_id}/gifter`
                        };
                        sgMail
                            .send(msg)
                            .then((data) => {
                                console.log("mail sent");
                            }, error => {
                                console.error(error);
                                if (error.response) {
                                    console.error(error.response.body)
                                }
                            });
                    } else {
                        twilioClient.messages.create({
                            from: "+15076695356",
                            to: parsePhoneNumber(req.body.sender_phone).format("E.164"),
                            body: `Hi! ${req.body.receiver_name}, ${req.body.sender_name} has send you a video message for the gift please click on the below link to view:
                                http://localhost:3001?${req.body.order_id}/gifter`
                        });
                    }
                } else {
                    const msg = {
                        to: req.body.receiver_contact,
                        from: 'atinacme1621@gmail.com', // Use the email address or domain you verified above
                        subject: 'Revert Gift Video Message',
                        text: `Hi! ${req.body.receiver_name}, ${req.body.sender_name} has send you a revert video message for your gift please click on the below link to view:
                        http://localhost:3001?${req.body.order_id}/receipient`
                    };
                    if (req.body.receiver_contact_type === 'email/phone') {
                        sgMail
                            .send(msg)
                            .then((data) => {
                                console.log("mail sent");
                                twilioClient.messages.create({
                                    from: "+15076695356",
                                    to: parsePhoneNumber(req.body.sender_phone).format("E.164"),
                                    body: `Hi! ${req.body.receiver_name}, ${req.body.sender_name} has send you a revert video message for your gift please click on the below link to view:
                                http://localhost:3001?${req.body.order_id}/receipient`
                                });
                            }, error => {
                                console.error(error);
                                if (error.response) {
                                    console.error(error.response.body)
                                }
                            });
                    } else if (req.body.receiver_contact_type === 'email') {
                        sgMail
                            .send(msg)
                            .then((data) => {
                                console.log("mail sent");
                            }, error => {
                                console.error(error);
                                if (error.response) {
                                    console.error(error.response.body)
                                }
                            });
                    } else {
                        twilioClient.messages.create({
                            from: "+15076695356",
                            to: parsePhoneNumber(req.body.sender_phone).format("E.164"),
                            body: `Hi! ${req.body.receiver_name}, ${req.body.sender_name} has send you a revert video message for your gift please click on the below link to view:
                            http://localhost:3001?${req.body.order_id}/receipient`
                        });
                    }
                }
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
            message: `Could not upload the file: ${req.file.filename}. ${err}`,
        });
    }
};

// Retrieve all Files of Particular Order Number from the database.

const findFile = (req, res) => {
    const order_id = req.params.order_id;
    const send_by = req.params.send_by;

    File.findOne({ raw: true, $and: [{ "order_id": order_id }, { "send_by": send_by }] })
        .then(data => {
            data["file"] = baseUrl + data.filename;
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving file."
            });
        });
};

const findFileGifter = (req, res) => {
    const order_id = req.params.order_id;

    File.findOne({ raw: true, where: [{ "order_id": order_id }, { "send_by": 'gifter' }] })
        .then(data => {
            data["file"] = baseUrl + data.filename;
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving file."
            });
        });
};

const findFileReceipient = (req, res) => {
    const order_id = req.params.order_id;

    File.findOne({ raw: true, where: [{ "order_id": order_id }, { "send_by": 'receipient' }] })
        .then(data => {
            data["file"] = baseUrl + data.filename;
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
    findFileGifter,
    findFileReceipient,
    getListFiles,
    download,
};