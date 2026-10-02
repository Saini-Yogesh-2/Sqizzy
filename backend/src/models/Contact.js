import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous' },
  email: { type: String, required: true, trim: true, lowercase: true },
  topic: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  visitorId: { type: String, default: '' },
  sessionId: { type: String, default: '' },
}, { timestamps: true });

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
