import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  const connection = await mongoose.connect(env.mongoUri);
  console.log(
    `MongoDB connected Successfully`,
  );
};
