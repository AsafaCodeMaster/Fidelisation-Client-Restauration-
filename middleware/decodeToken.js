const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function extractUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    console.log('extractUser: No token found.');
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log('extractUser: Invalid token during extraction.');
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

module.exports = { extractUser };
