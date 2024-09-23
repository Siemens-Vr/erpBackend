const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config()

const token = process.env.SECRET_KEY
// Middleware function to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {

  // Get the token from the request headers
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token
    const decoded = await jwt.verify(token, secret);
    console.log(decoded)
    req.user = decoded.user; // Add the decoded user object to the request
    next();

  } catch (error) {
    // If token verification fails, return 401 Unauthorized
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = isAuthenticated;

