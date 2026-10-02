import mongoose from 'mongoose';

let cachedPromise = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI not provided. Running in hybrid memory store mode with full persistence support when configured.');
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    }).then((conn) => {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return true;
    }).catch((error) => {
      cachedPromise = null;
      console.error('❌ MongoDB Connection Error:', error.message);
      return false;
    });

    return await cachedPromise;
  } catch (error) {
    cachedPromise = null;
    console.error('❌ MongoDB Connection Error:', error.message);
    return false;
  }
};

export const getIsConnected = () => mongoose.connection.readyState === 1;

