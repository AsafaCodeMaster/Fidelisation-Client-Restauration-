const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

async function connectClient(req, res) {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    const identificatorContact = req.body.contact;
    const plainPassword = req.body.password;

    // Find user by email or phone number
    const [rows] = await db.execute(
      'SELECT * FROM clients WHERE email = ? OR phone_number = ?',
      [identificatorContact, identificatorContact]
    );

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = rows[0];

    // Compare entered password with hashed one
    const validPassword = await bcrypt.compare(plainPassword, user.hashed_password);
    console.log('comparing the passwords');
    if (!validPassword) {
      console.log('invalid credential reached');
      return res.status(401).send('Invalid credentials');

    }

    // Create JWT token
    console.log('invalid credential not reached or valid ');
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

    // Send token to client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error accessing your account');
  }
}

module.exports = { connectClient };
