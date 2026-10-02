import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { SqizzyBottle } from '../components/common/SqizzyBottle';
import { SEO } from '../components/common/SEO';
import { initialProducts } from '../backend_mirror/products';
import { trackProductCtaClick } from '../analytics/tracker';

export const ProductsPage = ({ onOpenWaitlist }) => {
  const [selectedTag, setSelectedTag] = useState('All');
  const products = initialProducts;

  const tags = ['All', 'Smooth', 'Crunchy', 'Chocolate', 'High Protein', 'Vegan'];

  const filteredProducts = selectedTag === 'All'
    ? products
    : products.filter(p => p.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()));

  const handleCtaClick = (product) => {
    trackProductCtaClick(product, 'products_grid', 'Coming Soon');
    if (onOpenWaitlist) onOpenWaitlist(product.name);
  };

  return (
    <div className="py-12 md:py-20 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title="The Sqizzy Range — Squeeze Peanut Butter" 
        description="Explore the Sqizzy squeeze peanut butter collection. Original Smooth, Signature Crunch, Dark Cocoa Hazelnut, and High Protein Boost."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold"
          >
            Squeeze Perfection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-[#29150B] mt-2"
          >
            THE SQIZZY RANGE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base sm:text-lg text-[#785A48]"
          >
            Engineered with Gujarat golden peanuts and precision anti-drip nozzles for the cleanest drizzle imaginable.
          </motion.p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedTag === tag
                  ? 'bg-[#29150B] text-[#FFFBEB] shadow-md'
                  : 'bg-[#FFFBEB] text-[#785A48] border border-[#E8DCCF] hover:bg-[#FEF3C7]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-[#FFFBEB] rounded-3xl p-6 border border-[#E8DCCF] shadow-sqizzy hover:shadow-sqizzy-lg transition-all flex flex-col justify-between group hover:-translate-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: product.accentColor }}
                  >
                    {product.badge}
                  </span>
                  <span className="text-xs font-mono text-[#A88B77]">{product.size}</span>
                </div>

                {/* Squeeze Bottle Render */}
                <div className="py-6 flex justify-center">
                  <SqizzyBottle 
                    size="md" 
                    flavor={product.flavor} 
                    accentColor={product.accentColor} 
                    interactive={true} 
                  />
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-[#29150B] group-hover:text-[#D97706] transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-xs text-[#D97706] font-bold mt-0.5">{product.tagline}</p>
                  <p className="text-xs text-[#785A48] mt-2 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Flavor Profile Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {product.flavorProfile.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-[#FEF3C7] text-[#785A48] px-2 py-0.5 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#E8DCCF]/80 space-y-2">
                <button
                  onClick={() => handleCtaClick(product)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] text-xs font-black uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#29150B]" />
                  <span>COMING SOON</span>
                </button>

                <Link
                  to={`/products/${product.slug}`}
                  className="block text-center text-xs font-bold text-[#785A48] hover:text-[#D97706] py-1 transition-colors"
                >
                  Full Nutritional & Flavor Breakdown →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
