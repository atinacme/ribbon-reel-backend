const db = require("../models");
const Order = db.orders;
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

// Create and Save a new Order
exports.create = (req, res) => {
    var orders;
    Order.destroy({
        where: {},
        truncate: false
    });

    req.body.forEach(element => {
        // console.log('element---->',element)
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
            order_id: element.id,
            order_number: element.order_number,
            date: element.created_at,
            sender_name: element.customer.first_name + " " + element.customer.last_name,
            receiver_email: element.note_attributes.length > 0 ? element.note_attributes.map((item) => {
                if (item.name === 'receiver_email') {
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

exports.mail = (req, res) => {
    const mailConfigurations = {
        from: 'atinacme1621@gmail.com',
        to: req.body.mail_to,
        subject: 'Add Video Message',
        text: `Hi! ${req.body.sender_name}, if you want to add video message use the below link:
        http://localhost:3000?order_id=${req.body.order_id}?sender_name=${req.body.sender_name}`
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        res.send(info);
    });
};