const db = require('../config/database');

async function nextIfExist(req , res , next) {
     const identificatorContact = req.body.contact;
  

    const [rows] = await db.execute(
      'SELECT * FROM clients WHERE email = ? OR phone_number = ?',
      [identificatorContact, identificatorContact]
    );

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }
    next();

}
async function nextIfNotExist(req , res , next) {
    const identificatorContact = req.body.contact;
  

    const [rows] = await db.execute(
      'SELECT * FROM clients WHERE email = ? OR phone_number = ?',
      [identificatorContact, identificatorContact]
    );

    if (rows.length === 0) {
    next(); 
    }
     return res.status(404).send('User not found');
}

module.exports = {nextIfExist , nextIfNotExist};