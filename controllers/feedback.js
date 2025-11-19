const db = require('../config/database');

async function getClientFeedback(req, res) {
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
    res.render("feedback", { myclient });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving client info');
  }
}
async function submit(req , res) {

   try {
    const {
      overallRating,
      ratings,
      libreExpression,
      emailConsent,
      timestamp
    } = req.body;

    const clientId = req.userId;

    const query = `
      INSERT INTO feedback (
        client_id,
        overall_rating,
        produits_rating,
        accueil_rating,
        livraison_rating,
        prix_rating,
        fidelite_rating,
        libre_expression,
        email_consent,
        submitted_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      clientId,
      overallRating,
      ratings.produits,
      ratings.accueil,
      ratings.livraison,
      ratings.prix,
      ratings.fidelite,
      libreExpression || null,
      emailConsent ? 1 : 0,
      new Date(timestamp)
    ]);

    res.json({ success: true, message: 'Feedback submitted successfully' });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getClientFeedback  , submit};
