const db = require('../config/database');
const bcrypt = require('bcrypt');

async function storeOptinCode(req , res , next) {
  /*     const phoneRegex = /^\+?[\d\s-]{6,20}$/;
        if(phoneRegex.test(req.body.contact) ) return next(); */
    const firstname = req.body.nom;
    const lastname = req.body.prenom;
    const optin_receiver = req.body.contact;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = req.body.otp;
    const expirationDate = new Date(Date.now() + 10 * 60 * 1000);

  // Convert it to MySQL DATETIME format: YYYY-MM-DD HH:MM:SS
    const expiration = expirationDate.toISOString().slice(0, 19).replace('T', ' ');

    const query = `
      INSERT INTO pending (first_name , last_name ,optin_receiver, hashed_password , verification_code , expires_at)
      VALUES (? , ? , ? , ?, ? , ?)
    `;

    await db.execute(query, [
      firstname,
      lastname,
      optin_receiver,
      hashedPassword,
      code,
      expiration
    ]);
    next();
}
module.exports = {storeOptinCode};