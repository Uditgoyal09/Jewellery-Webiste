import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri:
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/ganesh-jewellers',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendDistPath: path.resolve(__dirname, '../../../frontend/dist'),
};
