import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  flavor: { type: String, required: true },
  flavorProfile: [{ type: String }],
  size: { type: String, default: '375g' },
  priceEstimate: { type: String, default: '$9.99' },
  ingredients: [{ type: String, required: true }],
  nutrition: {
    servingSize: { type: String, default: '32g (2 tbsp)' },
    calories: { type: String, default: '190 kcal' },
    totalFat: { type: String, default: '16g' },
    saturatedFat: { type: String, default: '2.5g' },
    protein: { type: String, default: '8g' },
    carbohydrates: { type: String, default: '7g' },
    dietaryFiber: { type: String, default: '3g' },
    totalSugars: { type: String, default: '1g' },
    addedSugars: { type: String, default: '0g' },
    sodium: { type: String, default: '65mg' },
    note: { type: String, default: 'Placeholder nutritional estimates for pre-launch preview.' }
  },
  benefits: [{ type: String }],
  usageTips: [{ type: String }],
  accentColor: { type: String, default: '#D97706' },
  badge: { type: String, default: 'Original' },
  images: {
    hero: { type: String, required: true },
    bottle: { type: String, required: true },
    drizzle: { type: String, required: true },
    lifestyle: { type: String, required: true },
    gallery: [{ type: String }]
  },
  featured: { type: Boolean, default: false },
  comingSoon: { type: Boolean, default: true },
  orderIndex: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
