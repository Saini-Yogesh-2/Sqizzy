import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true, index: true },
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  totalSessions: { type: Number, default: 1 },
  totalPageViews: { type: Number, default: 1 },
  device: {
    type: { type: String, default: 'desktop' },
    os: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' }
  },
  geo: {
    country: { type: String, default: 'United States' },
    region: { type: String, default: 'California' },
    city: { type: String, default: 'San Francisco' },
  },
  initialReferrer: { type: String, default: '' },
  initialUtm: {
    source: { type: String, default: '' },
    medium: { type: String, default: '' },
    campaign: { type: String, default: '' },
  },
}, { timestamps: true });

export const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
