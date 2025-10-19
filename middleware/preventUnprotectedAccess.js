const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function preventAuthenticatedAccess(req, res, next) {
  const token = req.cookies.token;

  if (!token) return next(); // no token → allow access

  try {
    jwt.verify(token, process.env.SECRET_KEY);
    // if valid → redirect to profile
    return res.redirect('/profile');
  } catch (err) {
    res.clearCookie('token');
    return next();
  }
}

module.exports = { preventAuthenticatedAccess };
