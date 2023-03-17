const db = require("../models");
const Op = db.Sequelize.Op;
const Order = db.orders;
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const parsePhoneNumber = require("libphonenumber-js/min")
const accountSid = 'ACd543b7bcb76e0e7ce9eff99e28689668';
const authToken = '1c313a3676c13526b5a345b5c960b344';
const twilioClient = require("twilio")(accountSid, authToken);

// Create and Save a new Order
exports.create = (req, res) => {
    var orders;
    Order.destroy({
        where: {},
        truncate: false
    });

    req.body.forEach(element => {
        const order_id = element.order_id;
        var condition = order_id ? { order_id: { [Op.iLike]: `%${order_id}%` } } : null;
        var reel_status;

        if (condition !== null) {
            File.findAll({ where: condition })
                .then(data => {
                    reel_status = res.send(data[0].reel_status);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving file."
                    });
                });
        } else {
            reel_status = 'pending';
        }
        const order = {
            store_name: element.session.shop,
            store_owner: element.store_owner,
            sender_email: element.contact_email,
            sender_phone: element.customer.phone,
            order_id: element.id,
            order_number: element.order_number,
            date: element.created_at,
            sender_name: element.customer.first_name + " " + element.customer.last_name,
            receiver_contact: element.note_attributes.length > 0 ? element.note_attributes.map((item) => {
                if (item.name === 'receiver_contact') {
                    return item.value;
                }
            }) : null,
            total: element.total_price,
            reel_revenue: element.reel_revenue,
            shipping_status: element.fulfillment_status,
            reel_status: element.reel_status,
            items: element.line_items.length
        };
        // Save Order in the database
        orders = Order.create(order);
    });

    orders.then(data => {
        res.send('All Orders Inserted and Updated');
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Order."
            });
        });
};

exports.findAll = (req, res) => {
    Order.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving orders."
            });
        });
};

exports.findParticularOrder = (req, res) => {
    const order_id = req.body.order_id;
    var condition = order_id ? { order_id: { [Op.iLike]: `%${order_id}%` } } : null;
    Order.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving orders."
            });
        });
};

exports.mailAndMessage = (req, res) => {
    const msg = {
        to: req.body.mail_to,
        from: 'atinacme1621@gmail.com', // Use the email address or domain you verified above
        subject: 'Add Video Message',
        text: `Hi! ${req.body.sender_name}, if you want to add video message use the below link:
        http://localhost:3000?${req.body.order_id}`
    };
    sgMail
        .send(msg)
        .then(() => {
            console.error("mail sent");
            twilioClient.messages.create({
                from: "+15076695356",
                to: parsePhoneNumber(req.body.sender_phone).format("E.164"),
                body: `Hi! ${req.body.sender_name}, if you want to add video message use the below link:
                http://localhost:3000?${req.body.order_id}`
            });
        }, error => {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        });

};