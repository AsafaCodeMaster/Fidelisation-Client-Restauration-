const db = require('../config/database');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
async function getClientPoints(req, res) {
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
    res.render("points", { myclient });

  } catch (error) {
    // // console.error(error);
    res.status(500).send('Error retrieving client info');
  }
}

async function loadOrders(req , res) {
  const userCookie  = jwt.verify(req.cookies.token , process.env.SECRET_KEY);
 
    try {
    const userId = userCookie.userId; // from middleware
    const [rows] = await db.execute(`
      SELECT id, total_price, order_date, point, status , remaining_points , description , type
      FROM orders
      WHERE id_client = ?
      ORDER BY order_date DESC
    `, [userId]);
      const pointsData = rows.map(row => {
      const isEarned = row.type == 'purchase';
      // console.log(row.id);

      return {
        id: row.id,
        type: isEarned ? 'purchase' : 'reward',
        date: row.order_date,
        description: isEarned
          ? `Achat de ${row.total_price} Ar`
          : row.description,
        points: row.point,
        balance: row.remaining_points ?? 0,
        status: row.status == 'success' ? 'completed' : 'pending'
      };
    });

    // Send formatted JSON
    // console.table(pointsData);
    res.json({
      success: true,
      data: pointsData
    });

  } catch (err) {
    // console.error('DB Error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
}

module.exports = { getClientPoints , loadOrders};
