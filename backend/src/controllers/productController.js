import { Product } from '../models/Product.js';
import { getIsConnected } from '../config/db.js';
import { initialProducts } from '../utils/seedData.js';

export const getProducts = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const products = await Product.find().sort({ orderIndex: 1 }).lean();
      if (products && products.length > 0) {
        return res.json({ success: true, data: products });
      }
    }
    // Fallback to static seed data
    return res.json({ success: true, data: initialProducts });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (getIsConnected()) {
      const product = await Product.findOne({ slug }).lean();
      if (product) {
        return res.json({ success: true, data: product });
      }
    }
    // Fallback search in initialProducts
    const fallbackProduct = initialProducts.find(p => p.slug === slug);
    if (!fallbackProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    return res.json({ success: true, data: fallbackProduct });
  } catch (error) {
    next(error);
  }
};
