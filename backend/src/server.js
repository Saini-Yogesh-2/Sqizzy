import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Vercel / reverse proxy for accurate IP & rate-limiting
app.set('trust proxy', 1);

// Security & Parsing Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://sqizzy.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (direct browser testing of /, mobile apps, curl, beacons)
    if (!origin) {
      return callback(null, true);
    }
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/sqizzy(-[a-z0-9-]+)?\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    // Fail gracefully for unknown origins
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Ensure database connection before processing API requests (essential for Vercel Serverless)
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database connection middleware error:', err.message);
    }
  }
  next();
});

// ── Root route — simple JSON status ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SQIZZY API is running correctly.' });
});

// ── JSON health check endpoint ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'SQIZZY',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount API Routes
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handling
app.use(errorHandler);

// Connect DB and start server (if not imported as serverless function)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 SQIZZY API Server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    });
  });
}

export default app;
