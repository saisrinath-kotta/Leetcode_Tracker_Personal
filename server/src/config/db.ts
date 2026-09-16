import mongoose from 'mongoose';
import { config } from './env.js';

export let isConnectedToDb = false;

function getSanitizedUri(uri: string): string {
  try {
    return uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  } catch {
    return 'MongoDB Target';
  }
}

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnectedToDb = true;
    console.log(`[Database] Successfully connected to MongoDB Atlas (${getSanitizedUri(config.mongoUri)})`);
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed or timed out: ${(error as Error).message}`);
    isConnectedToDb = false;
  }
}

