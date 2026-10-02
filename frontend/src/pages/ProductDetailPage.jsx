import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Droplet, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  Flame,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { SqizzyBottle } from '../components/common/SqizzyBottle';
import { SEO } from '../components/common/SEO';
import { initialProducts } from '../backend_mirror/products';
import { trackProductView, trackProductCtaClick } from '../analytics/tracker';

export const ProductDetailPage = ({ onOpenWaitlist }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, ingredients, nutrition, usage

  const product = initialProducts.find(p => p.slug === slug) || initialProducts[0];
  const relatedProducts = initialProducts.filter(p => p.slug !== product.slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackProductView(product);
  }, [product.slug]);

  const handleCta = () => {
    trackProductCtaClick(product, 'pdp_hero_cta', 'Coming Soon');
    if (onOpenWaitlist) onOpenWaitlist(product.name);
  };

  return (
    <div className="py-8 md:py-16 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title={`${product.name} — SQIZZY Squeeze Peanut Butter`}
        description={product.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[#785A48] mb-8">
          <Link to="/" className="hover:text-[#D97706]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-[#D97706]">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#29150B]">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Interactive Visual Showcase */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="bg-[#FFFBEB] rounded-3xl p-8 sm:p-12 border border-[#E8DCCF] shadow-sqizzy relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
              {/* Flavor Glow */}
              <div 
                className="absolute inset-0 opacity-15 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: product.accentColor }}
              ></div>

              <span 
                className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: product.accentColor }}
              >
                {product.badge}
              </span>

              <SqizzyBottle 
                size="hero" 
                flavor={product.flavor} 
                accentColor={product.accentColor} 
                interactive={true} 
              />

              <p className="text-xs text-[#785A48] mt-6 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                Interactive 3D preview. Click bottle to simulate drizzle.
              </p>
            </div>
          </div>

          {/* Right Column: Details, Ingredients & Pre-Launch CTA */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#D97706] uppercase tracking-wider">
                  {product.flavor}
                </span>
                <span className="text-xs text-[#A88B77]">• {product.size}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#29150B] mt-1">
                {product.name}
              </h1>

              <p className="text-sm sm:text-base font-semibold text-[#D97706] mt-1">
                {product.tagline}
              </p>

              <p className="text-sm sm:text-base text-[#785A48] mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pre-launch Coming Soon Card */}
            <div className="p-6 rounded-2xl bg-[#FFFBEB] border-2 border-[#F59E0B]/40 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#785A48]">Estimated Launch Price</span>
                  <div className="text-2xl font-black text-[#29150B]">{product.priceEstimate}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-black uppercase">
                  Pre-Launch Stage
                </div>
              </div>

              <button
                onClick={handleCta}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#29150B]" />
                <span>JOIN VIP WAITLIST FOR FIRST BATCH</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-[#A88B77]">
                ⚡ No payments taken. VIP members receive private access codes on launch day.
              </div>
            </div>

            {/* Tabbed Info Panels */}
            <div className="pt-4">
              <div className="flex border-b border-[#E8DCCF] gap-4 sm:gap-6 overflow-x-auto pb-2">
                {[
                  { id: 'overview', label: 'Key Benefits' },
                  { id: 'ingredients', label: 'Ingredients' },
                  { id: 'nutrition', label: 'Nutrition' },
                  { id: 'usage', label: 'How to Enjoy' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-xs sm:text-sm font-bold uppercase tracking-wider pb-2 relative transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#D97706]'
                        : 'text-[#785A48] hover:text-[#29150B]'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    {product.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#29150B] font-medium">{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-3 bg-[#FFFBEB] p-4 rounded-xl border border-[#E8DCCF]">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                      Simple, Clean Ingredients:
                    </div>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-[#29150B] space-y-1 font-medium">
                      {product.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-[#A88B77] italic mt-2">
                      Zero palm oil, zero hydrogenated vegetable fats, zero artificial preservatives.
                    </p>
                  </div>
                )}

                {activeTab === 'nutrition' && (
                  <div className="bg-[#FFFBEB] p-5 rounded-2xl border border-[#E8DCCF] space-y-3">
                    <div className="flex justify-between text-xs font-bold border-b border-[#E8DCCF] pb-2">
                      <span>Serving Size: {product.nutrition.servingSize}</span>
                      <span className="text-[#D97706]">{product.nutrition.calories}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-white border border-[#E8DCCF]">
                        <span className="text-[#785A48] block">Protein</span>
                        <span className="font-bold text-[#29150B]">{product.nutrition.protein}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#E8DCCF]">
                        <span className="text-[#785A48] block">Total Fat</span>
                        <span className="font-bold text-[#29150B]">{product.nutrition.totalFat}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#E8DCCF]">
                        <span className="text-[#785A48] block">Carbs</span>
                        <span className="font-bold text-[#29150B]">{product.nutrition.carbohydrates}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#E8DCCF]">
                        <span className="text-[#785A48] block">Fiber</span>
                        <span className="font-bold text-[#29150B]">{product.nutrition.dietaryFiber}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#E8DCCF]">
                        <span className="text-[#785A48] block">Total Sugars</span>
                        <span className="font-bold text-[#29150B]">{product.nutrition.totalSugars}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#E8DCCF]">
                        <span className="text-[#785A48] block">Sodium</span>
                        <span className="font-bold text-[#29150B]">{product.nutrition.sodium}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#A88B77] pt-2">
                      <Info className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{product.nutrition.note}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'usage' && (
                  <div className="space-y-3">
                    {product.usageTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#FFFBEB] border border-[#E8DCCF]">
                        <span className="w-5 h-5 rounded-full bg-[#D97706] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs sm:text-sm text-[#29150B] font-medium">{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Explore Other Flavors */}
        <div className="mt-24 pt-16 border-t border-[#E8DCCF]">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#29150B] mb-8">
            EXPLORE OTHER SQIZZY FLAVORS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.slug}
                to={`/products/${rel.slug}`}
                className="bg-[#FFFBEB] rounded-2xl p-5 border border-[#E8DCCF] hover:shadow-md transition-all group"
              >
                <div className="py-2 flex justify-center">
                  <SqizzyBottle size="sm" flavor={rel.flavor} accentColor={rel.accentColor} interactive={false} />
                </div>
                <h3 className="text-base font-bold text-[#29150B] group-hover:text-[#D97706] transition-colors mt-2">
                  {rel.name}
                </h3>
                <p className="text-xs text-[#785A48] mt-1">{rel.tagline}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
