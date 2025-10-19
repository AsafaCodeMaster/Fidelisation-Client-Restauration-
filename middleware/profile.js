const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

  if (!token) {
   // console.log("middleware profile.js says token is :" + token);
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);

    // Attach decoded data (ex: userId) to request object
    req.userId = verified.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = { verifyToken };