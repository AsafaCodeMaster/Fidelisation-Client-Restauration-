const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/database');
const nodemailer = require('nodemailer');
dotenv.config();

async function generateForgotPasswordToken(req , res , next) {
    const SECRET_KEY = process.env.RESET_PASSWORD_KEY;
    const token = jwt.sign({ contact : req.body.contact }, SECRET_KEY, { expiresIn: '1h' });

    req.body.token = token;

    next();

}
async function storeForgotPasswordToken(req , res , next) {

        const query = `
      INSERT INTO resetPasswords (contact, token)
      VALUES (?, ?)
    `;
        await db.execute(query, [
      req.body.contact,
      req.body.token
    ]);
    next();

}

async function sendForgotPasswordLinkMail(req , res) {
      try {
        // 1️⃣ Create the transporter
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });
    
        // 2️⃣ Create the email content
        const mailOptions = {
          from: "Fidelity App" ,
          to: req.body.contact,
          subject: 'Recupération de mot de passe',
          text: 'voici le lien menant vers la page de modification mot de passe',
          html: `<h3>here is your optin code http://localhost:3000/forgot-password/${req.body.token} </h3>`,
        };
    
        // 3️⃣ Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);
          res.status(200).send();
      } catch (error) {
        console.error('❌ Error sending email:', error.message);
      }
}

module.exports ={ generateForgotPasswordToken ,storeForgotPasswordToken, sendForgotPasswordLinkMail};