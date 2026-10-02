import { z } from 'zod';
import { Feedback } from '../models/Feedback.js';
import { getIsConnected } from '../config/db.js';
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

    if (getIsConnected()) {
      await Feedback.create(feedbackData);
    }
    
    // Store in memory cache
    getMemoryStore().feedback.unshift(feedbackData);

    return res.status(201).json({
      success: true,
      message: 'Thanks for helping us make Sqizzy better! Your feedback has been recorded.'
    });
  } catch (error) {
    next(error);
  }
};
