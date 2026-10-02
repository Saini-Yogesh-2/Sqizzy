import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  visitorId: { type: String, required: true, index: true },
  startTime: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  durationSeconds: { type: Number, default: 0 },
  pageViewsCount: { type: Number, default: 1 },
  pagesVisited: [{ type: String }],
  ctaClicksCount: { type: Number, default: 0 },
  referrer: { type: String, default: '' },
  utm: {
    source: { type: String, default: '' },
    medium: { type: String, default: '' },
    campaign: { type: String, default: '' },
  },
  device: {
    type: { type: String, default: 'desktop' },
    os: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
  },
}, { timestamps: true });

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
