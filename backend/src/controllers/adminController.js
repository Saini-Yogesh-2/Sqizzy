import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SqizzyAdmin2026!';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'sqizzy_super_secret_jwt_key_2026_production';

export const loginAdmin = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin password. Access denied.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { role: 'admin', user: 'sqizzy_owner', iat: Math.floor(Date.now() / 1000) },
      ADMIN_JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookie
    res.cookie('sqizzy_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token // also return for client header fallback
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication server error'
    });
  }
};

export const logoutAdmin = async (req, res) => {
  res.clearCookie('sqizzy_admin_token');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const checkAdminSession = async (req, res) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.sqizzy_admin_token) {
      token = req.cookies.sqizzy_admin_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    if (decoded && decoded.role === 'admin') {
      return res.json({ authenticated: true, user: 'sqizzy_owner' });
    }

    return res.status(401).json({ authenticated: false });
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
};
