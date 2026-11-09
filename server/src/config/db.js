import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Establish the MongoDB connection used by the whole application.
 */
export const connectDB = async () => {
  mongoose.set('strictQuery', true);

  try {
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
