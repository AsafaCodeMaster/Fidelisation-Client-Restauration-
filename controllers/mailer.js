
const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/../.env' });
const user = process.env.MAIL_USER;
const passord =process.env.MAIL_PASS;
// console.log(user +'and' +passord);
async function sendCodeEmail() {
  
  try {
    // 1️⃣ Create the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:user,
        pass:passord,
      },
    });

    // 2️⃣ Create the email content
    const mailOptions = {
      from: "Fidelity App" ,
      to: 'rakotondravao.harena06@gmail.com',
      subject: '✅ NodeMailer Test Email',
      text: 'If you received this, NodeMailer works!',
      html: '<h3>If you received this, NodeMailer works! 🚀</h3>',
    };

    // 3️⃣ Send the email
    const info = await transporter.sendMail(mailOptions);
    // console.log('✅ Email sent:', info.response);
  } catch (error) {
    // console.error('❌ Error sending email:', error.message);
  }
}

sendCodeEmail();
