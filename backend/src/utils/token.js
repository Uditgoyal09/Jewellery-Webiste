import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signToken = (user) =>
  jwt.sign({ userId: user._id.toString() }, env.jwtSecret, { expiresIn: '7d' });

export const getBearerToken = (header = '') => {
  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7);
};

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
