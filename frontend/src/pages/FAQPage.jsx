import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { trackFaqInteraction } from '../analytics/tracker';

export const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = [
    {
      category: "Product & Ingredients",
      questions: [
        {
          q: "What ingredients are inside a bottle of Sqizzy?",
          a: "Sqizzy Original Smooth contains 100% slow-roasted golden peanuts and a pinch of pink Himalayan salt. Our Cocoa flavor contains raw dark cocoa and hazelnut with a hint of coconut blossom nectar. We never add palm oil, hydrogenated fats, or artificial preservatives."
        },
        {
          q: "Is Sqizzy vegan and gluten-free?",
          a: "Yes! All Sqizzy products are 100% plant-based, dairy-free, vegan-certified, and naturally gluten-free."
        },
        {
          q: "How does Sqizzy stay smooth without hydrogenated oils or palm oil?",
          a: "We utilize a proprietary double-mill grinding technology and precise roasting curves that keep the peanut's natural oils in a stable microscopic emulsion without requiring chemical stabilizers or palm oil."
        }
      ]
    },
    {
      category: "Squeeze Bottle & Anti-Drip Valve",
      questions: [
        {
          q: "Will the nozzle clog on the Crunchy flavor?",
          a: "No! We engineered our Signature Crunch with micro-crushed peanut chunks calibrated to pass smoothly through the medical-grade silicone valve with zero blockage."
        },
        {
          q: "How do I ensure the cleanest squeeze?",
          a: "Shake the bottle for 3 seconds before first use, invert the bottle directly over your food, and apply gentle hand pressure. The anti-drip valve will instantly cut off flow when you release."
        },
        {
          q: "Is the bottle recyclable and BPA-free?",
          a: "Yes. All Sqizzy bottles are 100% BPA-free, food-safe, and curbside recyclable (Code 2 HDPE/Code 5 PP)."
        }
      ]
    },
    {
      category: "Launch & Availability",
      questions: [
        {
          q: "When will Sqizzy be available to buy?",
          a: "We are finalizing initial factory production batches. Joining the VIP waitlist guarantees you priority ordering for batch #1 before public retail launch."
        },
        {
          q: "Where will Sqizzy ship?",
          a: "Initial launch will ship across the United States and select direct-to-consumer regions, followed quickly by retail grocery partners."
        }
      ]
    },
    {
      category: "Storage & Shelf Life",
      questions: [
        {
          q: "Does Sqizzy need to be refrigerated?",
          a: "No refrigeration is required! Storing your Sqizzy bottle at ambient room temperature in your kitchen cabinet or pantry keeps the texture silky and drizzle-ready."
        },
        {
          q: "What is the expected shelf life?",
          a: "Unopened Sqizzy bottles have a 12-month shelf life. Once opened, we recommend enjoying within 3-4 months for peak aroma and flavor."
        }
      ]
    }
  ];

  const allQuestions = categories.flatMap((c) => c.questions);
  const filteredQuestions = searchQuery.trim()
    ? allQuestions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="py-12 md:py-20 bg-[#FDF8F0] min-h-screen">
      <SEO
        title="Frequently Asked Questions — SQIZZY"
        description="Everything you need to know about Sqizzy squeeze peanut butter, ingredients, silicone valve, and pre-launch availability."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
            Got Questions?
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#29150B] mt-2">
            FREQUENTLY ASKED
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#785A48]">
            Find answers to common questions about our ingredients, squeeze technology, and launch roadmap.
          </p>

          {/* Search Box */}
          <div className="relative mt-8 max-w-md mx-auto">
            <Search className="w-5 h-5 text-[#A88B77] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search questions (e.g., vegan, storage, nozzle)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFFBEB] border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
            />
          </div>
        </div>

        {/* Filtered Search Results */}
        {filteredQuestions ? (
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#D97706] font-bold">
              Search Results ({filteredQuestions.length})
            </h2>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((faq, i) => (
                <div key={i} className="bg-[#FFFBEB] p-6 rounded-2xl border border-[#E8DCCF]">
                  <h3 className="text-base font-bold text-[#29150B]">{faq.q}</h3>
                  <p className="text-sm text-[#785A48] mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-sm text-[#785A48]">No questions matched your search query.</p>
            )}
          </div>
        ) : (
          /* Categorized Accordion */
          <div className="space-y-12">
            {categories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <h2 className="text-lg font-display font-black text-[#29150B] uppercase tracking-wider border-b border-[#E8DCCF] pb-2">
                  {cat.category}
                </h2>

                <div className="space-y-3">
                  {cat.questions.map((faq, qIdx) => {
                    const uniqueKey = `${catIdx}_${qIdx}`;
                    const isOpen = openIndex === uniqueKey;
                    return (
                      <div
                        key={qIdx}
                        className="bg-[#FFFBEB] rounded-2xl border border-[#E8DCCF] overflow-hidden transition-all shadow-sm"
                      >
                        <button
                          onClick={() => {
                            const next = isOpen ? null : uniqueKey;
                            setOpenIndex(next);
                            trackFaqInteraction(`faq_${faq.q.slice(0, 20)}`, next ? 'expand' : 'collapse');
                          }}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#29150B] hover:text-[#D97706]"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-[#D97706] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 text-xs sm:text-sm text-[#785A48] leading-relaxed border-t border-[#E8DCCF]/60 pt-3">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
