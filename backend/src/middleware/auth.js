import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'sqizzy_super_secret_jwt_key_2026_production';

export const requireAdminAuth = (req, res, next) => {
  try {
    let token = null;

    // Check HTTP-only cookie
    if (req.cookies && req.cookies.sqizzy_admin_token) {
      token = req.cookies.sqizzy_admin_token;
    } 
    // Check Authorization Header fallback
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Admin authentication required to access this resource.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden. Invalid admin privileges.'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication session. Please log in again.'
    });
  }
};
