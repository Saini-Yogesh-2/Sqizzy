import { z } from 'zod';
import { Feedback } from '../models/Feedback.js';
import { connectDB, getIsConnected } from '../config/db.js';
import { getMemoryStore } from '../services/analyticsStore.js';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().min(2, 'Feedback is required'),
  name: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')),
  favoriteFlavor: z.string().optional().default(''),
  ageRange: z.string().optional().default(''),
  howHeard: z.string().optional().default(''),
  visitorId: z.string().optional().default(''),
  sessionId: z.string().optional().default('')
});

export const submitFeedback = async (req, res, next) => {
  try {
    const parseResult = feedbackSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format()
      });
    }

    const feedbackData = {
      ...parseResult.data,
      createdAt: new Date()
    };

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

      await Feedback.create(feedbackData);
      getMemoryStore().feedback.unshift(feedbackData);

      return res.status(201).json({
        success: true,
        message: 'Thanks for helping us make Sqizzy better! Your feedback has been recorded.'
      });
    }
    
    // Store in memory cache for local sandbox test
    getMemoryStore().feedback.unshift(feedbackData);

    return res.status(201).json({
      success: true,
      message: 'Thanks for helping us make Sqizzy better! Your feedback has been recorded.'
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save feedback to the database. Please try again.'
    });
  }
};
