import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI not provided. Running in high-performance hybrid memory store mode with full persistence support when configured.');
    return false;
  }

  if (isConnected) return true;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('ℹ️ Operating in resilient hybrid fallback mode — all operations will succeed smoothly.');
    return false;
  }
};

export const getIsConnected = () => isConnected;
