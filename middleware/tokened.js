const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Middleware to check if user is already logged in.
 * If valid token exists → redirect to /home.
 * Else → continue.
 */
function checkNotLoggedIn(req, res, next) {
  try {
    // Try to get token from Authorization header
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];


    // If token exists, verify it
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded) {
        // Token is valid → redirect to home
        return res.redirect('/home');
      }
    }

    // If no token or invalid → continue
    next();
  } catch (error) {
    // Token invalid or expired → continue to page
    next();
  }
}

module.exports = { checkNotLoggedIn };
