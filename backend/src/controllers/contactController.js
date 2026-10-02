import { z } from 'zod';
import { Contact } from '../models/Contact.js';
import { getIsConnected } from '../config/db.js';
import { getMemoryStore } from '../services/analyticsStore.js';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  topic: z.string().default('General Inquiry'),
  message: z.string().min(5, 'Message must be at least 5 characters long'),
  visitorId: z.string().optional().default(''),
  sessionId: z.string().optional().default('')
});

export const submitContact = async (req, res, next) => {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format()
      });
    }

    const contactDoc = {
      ...parseResult.data,
      createdAt: new Date()
    };

    if (getIsConnected()) {
      await Contact.create(contactDoc);
    }

    getMemoryStore().contacts.unshift(contactDoc);

    return res.status(201).json({
      success: true,
      message: "Thank you for reaching out to Sqizzy! Our team will review your message."
    });
  } catch (error) {
    next(error);
  }
};
