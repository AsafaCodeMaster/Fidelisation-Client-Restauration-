const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

function generateSecureOtp(req , res, next) {
  // Generate a random integer between 100000 and 999999, inclusive.
  const otp = crypto.randomInt(100000, 999999);
  req.body.otp = otp.toString();
  next();
}
async function sendCode(req, res , next) {
  if(req.body.contactType == 'email'){
   const isSent = await sendCodeEmail(req);
   if(!isSent){
    return res.status(400).json({
      success : false,
      message : 'OTP not sent'
    });
   }
   return next();
  }
  return next();



}
async function sendCodeEmail(req) {
     // const phoneRegex = /^\+?[\d\s-]{6,20}$/;
      //  if(phoneRegex.test(req.body.contact) ) return next();
  try {
    // 1️⃣ Create the transporter
    /* const code = generateSecureOtp();
    req.optin = code; */
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
      subject: 'Use this optin code for your signup to Our fidelity app',
      text: 'here is your Optin code ' + req.body.otp,
      html: `<h3>here is your optin code ${req.body.otp}! 🚀</h3>`,
    };

    // 3️⃣ Send the email
    const info = await transporter.sendMail(mailOptions);
/*     console.log('✅ Email sent:', info.response); */
    return true;
  } catch (error) {
/*     console.error('❌ Error sending email:', error.message); */
    return false;
  }
}
module.exports = {sendCode , generateSecureOtp};