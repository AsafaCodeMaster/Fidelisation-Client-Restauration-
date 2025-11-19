const db = require('../config/database');
const bcrypt = require('bcrypt');

async function getContactFromToken(token){
  const query = `SELECT contact FROM resetpasswords WHERE token = ?`;
  const [contacts] = await db.execute(query ,[token]);
  return contacts[0].contact;
}
async function getClientChangePassword(req, res) {
  try {
    const clientId = req.userId;

    // Fetch user info from DB
    const [rows] = await db.execute(
      'SELECT first_name, last_name, email, phone_number FROM clients WHERE id = ?',
      [clientId]
    );

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const myclient = rows[0];
    // Render the EJS page with client info
    res.render("changePassword", { myclient });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving client info');
  }
}
async function reset(req , res) {
  const passwords = req.body.password1;
  const password = await bcrypt.hash(passwords, 10);
  const contact =  await getContactFromToken(req.body.token);

  const query = `UPDATE clients
SET hashed_password = ? WHERE email = ? OR phone_number = ?`;
  await db.execute(query , [password, contact , contact]);

  res.redirect('/login');

}
async function change(req , res) {
  console.log("change attempt detected");
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  try {
      if(await verifyPassword(req  , currentPassword)){
            const password = await bcrypt.hash(newPassword,10);
              const query = `UPDATE clients
SET hashed_password = ? WHERE id = ?`;
  await db.execute(query , [password, req.userId]);
  res.json({success : true});
  }else{
    console.log("wrong password");
  }
  } catch (error) {
    console.log("error changing password");
  }

}
async function verifyPassword(req , password) {
  try {
      const query = `SELECT hashed_password FROM clients WHERE id = ?`;
  const [result] = await db.execute(query , [req.userId]);
  const client = result[0];
  
  return await bcrypt.compare(password ,client.hashed_password);
  } catch (error) {
    console.log('cannot verify password during changes ' + error);
  }


}
module.exports = { getClientChangePassword , reset , change};
