import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Product } from '../models/Product.js';
import { initialProducts } from './seedData.js';

dotenv.config();

const seed = async () => {
  console.log('🥜 Starting Sqizzy Database Seed...');
  const connected = await connectDB();

  if (connected) {
    try {
      console.log('Clearing existing product collection...');
      await Product.deleteMany({});
      console.log('Inserting Sqizzy product range...');
      const created = await Product.insertMany(initialProducts);
      console.log(`✅ Successfully seeded ${created.length} Sqizzy products into MongoDB:`);
      created.forEach(p => console.log(`  - ${p.name} (${p.slug})`));
      process.exit(0);
    } catch (err) {
      console.error('Seed error:', err);
      process.exit(1);
    }
  } else {
    console.log('ℹ️ Operating in fallback in-memory mode. Products are auto-loaded on server start.');
    process.exit(0);
  }
};

seed();
