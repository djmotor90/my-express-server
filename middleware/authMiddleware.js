// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const tokenHeader = req.header('Authorization');
  const tokenCookie = req.cookies.token; // Parse the token from the cookie

  // Check if the token is present in the header or cookie
  if (!tokenHeader && !tokenCookie) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  try {
    let token;
    if (tokenHeader) {
      // Check if the token starts with "Bearer " and remove it if present
      const tokenWithoutBearer = tokenHeader.startsWith('Bearer ') ? tokenHeader.slice(7) : tokenHeader;
      token = tokenWithoutBearer;
    } else if (tokenCookie) {
      // Use the token from the cookie
      token = tokenCookie;
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging: Print token and verified user
    console.log('Token:', token);
    console.log('Verified User:', verified);

    req.user = verified; // You can access the user ID in your route handlers as req.user.userId
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error:', error);

    // Debugging: Print the error
    console.error('Token Verification Error:', error);

    return res.status(401).json({ error: 'Invalid token.' });
  }
};
