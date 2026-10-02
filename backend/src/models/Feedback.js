import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: true },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  favoriteFlavor: { type: String, default: '' },
  ageRange: { type: String, default: '' },
  howHeard: { type: String, default: '' },
  visitorId: { type: String, default: '' },
  sessionId: { type: String, default: '' },
}, { timestamps: true });

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
