import { z } from 'zod';
import { Waitlist } from '../models/Waitlist.js';
import { connectDB, getIsConnected } from '../config/db.js';
import { getMemoryStore } from '../services/analyticsStore.js';

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  productInterest: z.string().optional().default('All Flavors'),
  city: z.string().optional().default(''),
  source: z.string().optional().default('website_waitlist'),
  visitorId: z.string().optional().default(''),
  sessionId: z.string().optional().default('')
});

export const joinWaitlist = async (req, res, next) => {
  try {
    const parseResult = waitlistSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: parseResult.error.format()
      });
    }

    const { email, name, phone, productInterest, city, source, visitorId, sessionId } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();

    const waitlistDoc = {
      email: cleanEmail,
      name,
      phone,
      productInterest,
      city,
      source,
      visitorId,
      sessionId,
      createdAt: new Date()
    };

    // If MongoDB connection string is configured, enforce strict DB persistence
    if (process.env.MONGODB_URI) {
      if (!getIsConnected()) {
        const connected = await connectDB();
        if (!connected) {
          return res.status(503).json({
            success: false,
            error: 'Database connection currently unavailable. Please try again in a moment.'
          });
        }
      }

      // Check if already in MongoDB
      const existingInDb = await Waitlist.findOne({ email: cleanEmail });
      if (existingInDb) {
        return res.status(200).json({
          success: true,
          alreadyJoined: true,
          message: "You're already on the Sqizzy VIP waitlist! We'll keep you updated."
        });
      }

      // Save directly to MongoDB
      await Waitlist.create(waitlistDoc);
      getMemoryStore().waitlist.unshift(waitlistDoc);

      return res.status(201).json({
        success: true,
        message: "You're officially on the Sqizzy VIP list! You'll be the first to know when we launch."
      });
    }

    // Fallback for local sandbox testing without MongoDB_URI
    const existingInMemory = getMemoryStore().waitlist.find(w => w.email === cleanEmail);
    if (existingInMemory) {
      return res.status(200).json({
        success: true,
        alreadyJoined: true,
        message: "You're already on the Sqizzy VIP waitlist! We'll keep you updated."
      });
    }

    getMemoryStore().waitlist.unshift(waitlistDoc);

    return res.status(201).json({
      success: true,
      message: "You're officially on the Sqizzy VIP list! You'll be the first to know when we launch."
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        alreadyJoined: true,
        message: "You're already on the Sqizzy VIP waitlist! We'll keep you updated."
      });
    }
    console.error('Waitlist submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save waitlist submission to the database. Please try again.'
    });
  }
};
