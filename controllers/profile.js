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

module.exports = { getClientProfile };
