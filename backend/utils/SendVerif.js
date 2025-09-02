// intnya buat OBJECT jalannya transport dulu

const nodemailer = require('nodemailer');

require('dotenv').config()

const transport = nodemailer.createTransport({
    host:'smtp.mailtrap.io',
    port:process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_ADDRESS,
        pass:process.env.PASSWORD_EMAIL
    }
    
});

module.exports = transport;