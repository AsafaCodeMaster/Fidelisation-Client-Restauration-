const db = require('../../config/database');
const express = require('express');
const router = express.Router();
const profileMiddelware = require('../../middleware/preventProtectedAccess');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' , profileMiddelware.verifyToken,decodeToken.extractUser, async (req , res) => {
    const locals = {isAuthenticated : true}
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
   res.render('notFound' , {locals : locals , myclient});

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving client info');
  }
 
});
router.get('/' , profileMiddelware.verifyToken,decodeToken.extractUser, async (req , res) => {
    res.render('notFound');
});
module.exports = router;