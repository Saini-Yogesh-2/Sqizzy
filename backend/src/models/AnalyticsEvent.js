import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    index: true,
    enum: [
      'page_view',
      'session_start',
      'session_end',
      'product_view',
      'product_cta_click',
      'hero_cta_click',
      'waitlist_open',
      'waitlist_submit',
      'feedback_open',
      'feedback_submit',
      'about_view',
      'faq_open',
      'faq_interaction',
      'scroll_depth',
      'external_link_click',
      'navigation_click',
      'recipe_click',
      'contact_submit'
    ]
  },
  visitorId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  page: { type: String, required: true },
  referrer: { type: String, default: '' },
  productId: { type: String, default: null, index: true },
  productSlug: { type: String, default: null },
  location: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  device: {
    type: { type: String, default: 'desktop' },
    os: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
    screen: { type: String, default: '' },
  },
  utm: {
    source: { type: String, default: '' },
    medium: { type: String, default: '' },
    campaign: { type: String, default: '' },
    term: { type: String, default: '' },
    content: { type: String, default: '' },
  },
  geo: {
    country: { type: String, default: 'United States' },
    region: { type: String, default: 'California' },
    city: { type: String, default: 'San Francisco' },
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

analyticsEventSchema.index({ event: 1, timestamp: -1 });
analyticsEventSchema.index({ visitorId: 1, sessionId: 1 });
analyticsEventSchema.index({ productId: 1, event: 1 });

export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', analyticsEventSchema);
