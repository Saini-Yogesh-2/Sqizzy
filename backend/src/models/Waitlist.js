import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  productInterest: { type: String, default: 'All Flavors' },
  city: { type: String, default: '' },
  source: { type: String, default: 'website_waitlist' },
  visitorId: { type: String, default: '' },
  sessionId: { type: String, default: '' },
}, { timestamps: true });

export const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);
