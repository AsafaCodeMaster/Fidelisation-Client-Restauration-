const db = require('../config/database');
const bcrypt = require('bcrypt');

async function addClient(req, res) {
  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Determine which contact is provided
    const phone = req.body.contact.match(/^\d+$/) ? req.body.contact : '';
    const email = phone ? '' : req.body.contact;

    var matched;
    if(phone == req.body.contact){
          const [existing] = await db.execute(
      `SELECT * FROM clients WHERE phone_number = ?`,
      [phone]
    );
        matched = existing;
    }
    else{
          const [existing] = await db.execute(
      `SELECT * FROM clients WHERE email = ?`,
      [email]
    );
        matched = existing;
    }
    if (matched.length > 0) {
      // user already exists
      return res.status(400).send('This email or phone number already exists!');
    }

    const query = `
      INSERT INTO clients (first_name, last_name, phone_number, email, hashed_password)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      req.body.nom,
      req.body.prenom,
      phone,
      email,
      hashedPassword
    ]);

    // send response
    res.status(201).send('Client successfully registered!');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error during registration.');
  }
}

module.exports = { addClient };
