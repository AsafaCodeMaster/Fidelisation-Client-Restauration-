const db = require('../config/database');

async function getClientProfile(req, res) {
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
    res.render("profile", { myclient });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving client info');
  }
}
async function update(req , res) {
  try {
    const newData = req.body;
    let genre = newData.genre == 'homme' ? 'male' : 'other';
    genre = newData.genre == 'femme' ? 'female' : genre;
    console.table(newData);
    const query = ` UPDATE clients
      SET 
        first_name = ?,
        last_name = ?,
        email = ?,
        phone_number = ?,
        address = ?,
        city = ?,
        birth_date = ?,
        gender = ?
      WHERE id = ?`;
      await db.execute(query , [newData.nom , newData.prenom , newData.email  , newData.numero , newData.adresse , newData.ville , newData.dateNaissance , genre , req.userId]);
      console.log(req.userId);
  res.json({success : true});
  } catch (error) {
    console.log(error);
  }

}
async function deleteAccount(req , res) {

  try {
  const id = req.userId;
  const deleteUser = `DELETE FROM clients WHERE id = ?`;
  await db.execute(deleteUser , [id]);
    console.log('oay letie');
  res.json({success : true}); 
  } catch (error) {
    console.log(error);
  }

}
module.exports = { getClientProfile , update , deleteAccount};
