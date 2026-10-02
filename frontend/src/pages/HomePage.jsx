import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Droplet, 
  Leaf, 
  ShieldCheck, 
  ChevronDown, 
  HelpCircle, 
  Star,
  Zap,
  UtensilsCrossed
} from 'lucide-react';
import { SqizzyBottle } from '../components/common/SqizzyBottle';
import { JarComparison } from '../components/common/JarComparison';
import { SEO } from '../components/common/SEO';
import { initialProducts } from '../backend_mirror/products';
import { 
  trackHeroCtaClick, 
  trackProductCtaClick, 
  trackFaqInteraction,
  trackRecipeClick 
} from '../analytics/tracker';

export const HomePage = ({ onOpenWaitlist }) => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const products = initialProducts;

  const handleHeroCta = () => {
    trackHeroCtaClick('Get Sqizzy - Hero', 'homepage_hero');
    if (onOpenWaitlist) onOpenWaitlist('All Flavors');
  };

  const handleProductCta = (product) => {
    trackProductCtaClick(product, 'homepage_showcase', 'Coming Soon');
    if (onOpenWaitlist) onOpenWaitlist(product.name);
  };

  const benefitPillars = [
    { icon: <Droplet className="w-6 h-6 text-[#F59E0B]" />, title: "Precision Anti-Drip", desc: "No drips on your counter. Squeeze with chef-level control." },
    { icon: <Flame className="w-6 h-6 text-[#F97316]" />, title: "Slow Golden Roast", desc: "Double-milled Gujarat peanuts for unmatched natural aroma." },
    { icon: <Leaf className="w-6 h-6 text-[#10B981]" />, title: "Zero Palm Oil", desc: "Only pure peanuts, natural cocoa, and pink Himalayan salt." },
    { icon: <Zap className="w-6 h-6 text-[#D97706]" />, title: "Shake & Drizzle", desc: "Never stir a separated oily puddle again. Ready in 3s." }
  ];

  const waysToSqizzy = [
    { name: "Crispy Sourdough Toast", desc: "Drizzle golden peanut butter over warm artisan sourdough with sliced bananas.", time: "2 min breakfast", color: "from-[#F59E0B]/20 to-[#D97706]/10" },
    { name: "Fluffy Golden Pancakes", desc: "Replace heavy maple syrup with warm chocolate cocoa peanut drizzle.", time: "Weekend brunch", color: "from-[#F97316]/20 to-[#EA580C]/10" },
    { name: "Steel-Cut Morning Oats", desc: "A generous protein squeeze straight into hot cinnamon apple oats.", time: "Power bowl", color: "from-[#D97706]/20 to-[#B45309]/10" },
    { name: "Post-Workout Smoothie", desc: "Squeeze 12g of clean plant protein directly into your blender.", time: "Recovery fuel", color: "from-[#10B981]/20 to-[#047857]/10" },
    { name: "Crisp Green Apple Slices", desc: "Dip fresh fruit with zero spoon-washing required.", time: "Anytime snack", color: "from-[#FBBF24]/20 to-[#D97706]/10" },
    { name: "Acai & Chia Bowls", desc: "Artistic swirls that look and taste like a boutique cafe bowl.", time: "Superfood bowl", color: "from-[#8B5CF6]/20 to-[#6D28D9]/10" },
  ];

  const faqs = [
    {
      q: "What makes Sqizzy different from traditional jar peanut butter?",
      a: "Traditional peanut butter separates into oil puddles that require messy stirring and leaves sticky residue on your knuckles. Sqizzy uses a proprietary micro-mill process and an ergonomic squeeze bottle with a precision silicone anti-drip valve: simply shake for 3 seconds, squeeze, and drizzle with zero mess and zero cutlery."
    },
    {
      q: "When is Sqizzy officially launching?",
      a: "We are currently completing pilot production runs and packaging certification. Joining our VIP waitlist guarantees you early access to the very first limited release batches before general public availability."
    },
    {
      q: "Is Sqizzy 100% plant-based and vegan?",
      a: "Yes! All Sqizzy flavors are 100% plant-based, dairy-free, gluten-free, and crafted with zero palm oil or hydrogenated fats."
    },
    {
      q: "What flavors will be available at launch?",
      a: "Our launch line includes Sqizzy Original Smooth, Sqizzy Signature Crunch (micro-crushed bits that flow effortlessly), Sqizzy Dark Cocoa Hazelnut (low-sugar single-origin cocoa), and Sqizzy High Protein Boost (12g clean plant protein)."
    },
    {
      q: "How should I store my Sqizzy bottle?",
      a: "Store at room temperature in your pantry or kitchen counter for optimal drizzle texture. No refrigeration is required, and keeping it at ambient temperature ensures it always squeezes smoothly."
    }
  ];

  return (
    <div className="overflow-x-hidden">
      <SEO 
        title="SQIZZY — Peanut Butter. Rethought." 
        description="Shake. Squeeze. Drizzle. The modern all-natural squeeze peanut butter designed for zero stirring, zero oil mess, and effortless drizzling."
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-32 md:pt-16 md:pb-40 bg-gradient-to-b from-[#FDF8F0] via-[#FFFBEB] to-[#FDF8F0] overflow-visible">
        {/* Soft Background Accent Circles */}
        <div className="absolute top-10 right-1/4 w-80 sm:w-[32rem] h-80 sm:h-[32rem] bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* VIP Launch Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-xs sm:text-sm font-bold shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D97706] animate-pulse" />
                <span>Pre-Launch VIP Access Open</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-[#29150B] tracking-tight leading-[1.05]"
              >
                PEANUT BUTTER. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#B45309]">
                  RETHOUGHT.
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-[#785A48] font-medium max-w-xl mx-auto lg:mx-0 leading-snug"
              >
                Smooth. Delicious. Ridiculously easy to drizzle. 100% slow-roasted peanuts in an anti-drip squeeze bottle.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <button
                  onClick={handleHeroCta}
                  className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-extrabold text-base uppercase tracking-wider shadow-xl hover:shadow-2xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  <Sparkles className="w-5 h-5 text-[#29150B]" />
                  <span>GET SQIZZY</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/products"
                  className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-white border-2 border-[#E8DCCF] text-[#29150B] font-bold text-base hover:bg-[#FEF3C7]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore The Range</span>
                </Link>
              </motion.div>

              {/* Quick Trust Checks */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 text-xs font-bold text-[#785A48]"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706]" /> No Stirring Ever
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706]" /> Zero Palm Oil
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706]" /> BPA-Free Bottle
                </span>
              </motion.div>

            </div>

            {/* Right Column: Interactive Bottle Visual */}
            <div className="lg:col-span-5 flex items-center justify-center relative pb-16 md:pb-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative overflow-visible"
              >
                <SqizzyBottle 
                  size="hero" 
                  flavor="Original Roasted" 
                  accentColor="#D97706" 
                  interactive={true} 
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. BENEFIT STRIP */}
      <section className="py-12 bg-[#FFFBEB] border-y border-[#E8DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitPillars.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 border border-[#E8DCCF]/60 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-xl bg-[#FEF3C7] flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#29150B]">{b.title}</h3>
                  <p className="text-xs text-[#785A48] mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. GOODBYE JAR COMPARISON */}
      <JarComparison onWaitlistClick={() => onOpenWaitlist('All Flavors')} />

      {/* 4. PRODUCT SHOWCASE */}
      <section className="py-20 md:py-28 bg-[#FDF8F0] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
              The Lineup
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#29150B] mt-2">
              MEET THE SQIZZY RANGE
            </h2>
            <p className="mt-3 text-[#785A48] text-base sm:text-lg">
              Every bottle is crafted for maximum flavor impact and silky drizzle flow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#FFFBEB] rounded-3xl p-6 border border-[#E8DCCF] shadow-sqizzy hover:shadow-sqizzy-lg transition-all flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: product.accentColor }}
                    >
                      {product.badge}
                    </span>
                    <span className="text-xs font-mono text-[#A88B77]">{product.size}</span>
                  </div>

                  {/* Visual Squeeze Render */}
                  <div className="py-4 flex justify-center">
                    <SqizzyBottle 
                      size="sm" 
                      flavor={product.flavor} 
                      accentColor={product.accentColor} 
                      interactive={true} 
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-[#29150B] group-hover:text-[#D97706] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#D97706] font-semibold mt-0.5">{product.tagline}</p>
                    <p className="text-xs text-[#785A48] mt-2 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-6 pt-4 border-t border-[#E8DCCF]/80 space-y-2">
                  <button
                    onClick={() => handleProductCta(product)}
                    className="w-full py-3 px-4 rounded-xl bg-[#29150B] text-[#FFFBEB] text-xs font-extrabold uppercase tracking-wider hover:bg-[#D97706] hover:text-[#29150B] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>COMING SOON</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to={`/products/${product.slug}`}
                    className="block text-center text-xs font-bold text-[#785A48] hover:text-[#D97706] py-1 transition-colors"
                  >
                    View Ingredients & Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-[#D97706] text-[#D97706] font-bold text-sm uppercase tracking-wider hover:bg-[#D97706] hover:text-white transition-all shadow-md"
            >
              <span>Explore All Product Profiles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. WAYS TO SQIZZY (PAIRINGS GRID) */}
      <section className="py-20 bg-[#FFFBEB] border-y border-[#E8DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
              Versatile Fuel
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#29150B] mt-2">
              6 WAYS TO SQIZZY EVERY DAY
            </h2>
            <p className="mt-3 text-[#785A48] text-base">
              No knife needed. Drizzle golden roasted fuel effortlessly onto your favorites.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {waysToSqizzy.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => trackRecipeClick(item.name)}
                className={`p-6 rounded-3xl bg-gradient-to-br ${item.color} border border-[#E8DCCF] shadow-sm hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#B45309] bg-white/80 px-2.5 py-1 rounded-md">
                    {item.time}
                  </span>
                  <UtensilsCrossed className="w-4 h-4 text-[#D97706] group-hover:rotate-45 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-[#29150B] group-hover:text-[#D97706] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-[#785A48] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. BRAND STORY TEASER */}
      <section className="py-20 md:py-28 bg-[#190B05] text-[#FFFBEB] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
            The Origin
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black mt-3 leading-tight">
            "WE LOVED PEANUT BUTTER. <br />
            <span className="text-[#F59E0B]">WE HATED THE STICKY JAR."</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#E8DCCF]/80 max-w-2xl mx-auto leading-relaxed">
            One morning in 2024, another slice of sourdough broke under a cold, stiff block of jar peanut butter. Oil pooled over the kitchen counter. We decided enough was enough.
          </p>

          <div className="mt-10">
            <Link
              to="/our-story"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#F59E0B] text-[#29150B] font-extrabold text-sm uppercase tracking-wider hover:bg-[#F97316] transition-all shadow-xl"
            >
              <span>Read The Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. ACCORDION FAQ */}
      <section className="py-20 md:py-28 bg-[#FDF8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#29150B] mt-2">
              FREQUENTLY ASKED
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-[#FFFBEB] border border-[#E8DCCF] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => {
                      const nextState = isOpen ? null : idx;
                      setActiveFaq(nextState);
                      trackFaqInteraction(`faq_${idx}`, nextState !== null ? 'expand' : 'collapse');
                    }}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#29150B] hover:text-[#D97706] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#D97706] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-6 text-sm text-[#785A48] leading-relaxed border-t border-[#E8DCCF]/50 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. FINAL WAITLIST CTA STRIP */}
      <section className="py-20 bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#EA580C] text-[#29150B] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight">
            BE FIRST TO TRY SQIZZY.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#29150B]/90 max-w-xl mx-auto font-medium">
            Join thousands of breakfast lovers waiting for the cleanest, smoothest peanut butter squeeze.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onOpenWaitlist('All Flavors')}
              className="py-4 px-10 rounded-2xl bg-[#29150B] text-[#FFFBEB] font-black text-base uppercase tracking-wider shadow-2xl hover:bg-[#190B05] active:scale-95 transition-all flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              <span>CLAIM YOUR VIP ACCESS</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
