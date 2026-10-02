import { z } from 'zod';
import { Waitlist } from '../models/Waitlist.js';
import { getIsConnected } from '../config/db.js';
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

    // Check duplicate in memory
    const existingInMemory = getMemoryStore().waitlist.find(w => w.email === cleanEmail);
    if (existingInMemory) {
      return res.status(200).json({
        success: true,
        alreadyJoined: true,
        message: "You're already on the Sqizzy VIP waitlist! We'll keep you updated."
      });
    }

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

    if (getIsConnected()) {
      try {
        await Waitlist.findOneAndUpdate(
          { email: cleanEmail },
          { $setOnInsert: waitlistDoc },
          { upsert: true }
        );
      } catch (dbErr) {
        if (dbErr.code === 11000) {
          return res.status(200).json({
            success: true,
            alreadyJoined: true,
            message: "You're already on the Sqizzy VIP waitlist! We'll keep you updated."
          });
        }
      }
    }

    getMemoryStore().waitlist.unshift(waitlistDoc);

    return res.status(201).json({
      success: true,
      message: "You're officially on the Sqizzy VIP list! You'll be the first to know when we launch."
    });
  } catch (error) {
    next(error);
  }
};
