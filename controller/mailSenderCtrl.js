const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const mailSender = asyncHandler(async (req, res) => {
    const { to, subject, text, html } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.MAIL_ID,
            pass: process.env.Mp,
        },
    });


    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Mikey_Portfolio" <support@mikey.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    res.send({message: "Mail Sent Successfully."});

})

module.exports = { mailSender };