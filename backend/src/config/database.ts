import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoUri = process.env['MONGODB_URI'];
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  await mongoose.connect(mongoUri);
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
}; 