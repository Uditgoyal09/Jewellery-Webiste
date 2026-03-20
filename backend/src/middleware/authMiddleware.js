import { User } from '../models/User.js';
import { getBearerToken, verifyToken } from '../utils/token.js';

export const optionalAuth = async (req, _res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyToken(token);
    req.user = await User.findById(payload.userId);
  } catch {
    req.user = null;
  }

  next();
};

export const requireAuth = async (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: 'Please sign in to continue.' });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: 'Your session is no longer valid.' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Your session is no longer valid.' });
  }
};
