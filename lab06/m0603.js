const nodemailer = require('nodemailer');

module.exports = (message) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'metpolina29@gmail.com',
            pass: 'jlgodbcpkjvxajtq'
        }
    });

    const mailOptions = {
        from: 'metpolina29@gmail.com',
        to: 'metla.p@mail.ru',
        subject: 'Module m0603',
        html: `<p>${message}</p>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
        });
};