const db = require('../config/database');

async function addClient(req, res , next) {
  try {
    // hash the password

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
      req.body.password
    ]);

    // send response
  /*   const phoneRegex = /^\+?[\d\s-]{6,20}$/;
    if(!(phoneRegex.test(req.body.contact)))  return next();
        res.redirect('/login'); */
  return next();

  } catch (error) {
/*     console.error(error); */
    res.status(500).send('Error during registration.');
  }
}
async function deleteOptin(req, res) {
  const optin = req.body.optinCode;

      await db.execute(
      'DELETE FROM pending WHERE verification_code = ?',
      [optin]
    );
    return res.redirect('/login');
  
}

module.exports = { addClient , deleteOptin };
