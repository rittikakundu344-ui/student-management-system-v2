import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided, please login' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};
