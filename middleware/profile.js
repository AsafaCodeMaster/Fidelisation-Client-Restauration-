const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log('middleware verifyToken.js: No token provided.' + req.cookies.token);
    return res.redirect('/login');
  }

  try {
    // Verify token validity
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    console.log('verifyToken: Invalid or expired token -> clearing cookie');
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

module.exports = { verifyToken };
