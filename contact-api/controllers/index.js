const nodemailer = require('nodemailer');
require('dotenv').config();
var https   = require("https");
var fs      = require("fs");

const sendEmail =(req,res)=>{
    const name= req.body.user.name;
    const email =req.body.user.email;


    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Message Received',
        text: name +' Your  message was received . We will contact you shortly . Keep shooping with us for more discounts .',

    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });	

}

const sendInvoice= (req,res)=>{
    const name= req.body.user.name;
   const email =req.body.user.email;

   // make function to send email

    function generateInvoice(invoice, filename, success, error) {
        var postData = JSON.stringify(invoice);
        var options = {
            hostname  : "invoice-generator.com",
            port      : 443,
            path      : "/",
            method    : "POST",
            headers   : {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        var file = fs.createWriteStream(filename);

        var req = https.request(options, function(res) {
            res.on('data', function(chunk) {
                file.write(chunk);
            })
            .on('end', function() {
                file.end();

                if (typeof success === 'function') {
                    success();
                }
            });
        });
        req.write(postData);
        req.end();

        if (typeof error === 'function') {
            req.on('error', error);
        }
    }

    var invoice = {
        logo: "https://en.wikipedia.org/wiki/Manchester_United_F.C.#/media/File:Manchester_United_FC_crest.svg",
        from: "United Store",
        to: name,
        currency: "USD",
        number: "INV-0001",
        payment_terms: "Paid",
        items: [
            {
                name: "Homey Jersey 2020-2021",
                quantity: 1,
                unit_cost: 500
            }
        ],
        fields: {
            tax: ""
        },
        tax:0,
        notes: "Thanks for being an awesome customer!",
        terms: "Thank you for the payment.Please retain this invoive to claim refund in future."
    };

    generateInvoice(invoice, 'invoice.pdf', function() {
       res.send("Saved invoice to invoice.pdf");
    }, function(error) {
        res.send(error);
    });

    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });
    
    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Order Sucesfully Placed',
        text: 'You\'re order is on its way!. We will notify you when its out for delivery . Happy Shooping.',
        attachments :[
            { 
              filename: 'invoice.pdf',
              path: process.env.PATH
            }
          ]

    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });	
}

module.exports = {
    sendEmail,
    sendInvoice
}

