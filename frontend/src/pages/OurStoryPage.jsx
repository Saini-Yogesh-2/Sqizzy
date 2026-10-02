import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Flame, Droplet, Heart, Clock } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { SqizzyBottle } from '../components/common/SqizzyBottle';

export const OurStoryPage = ({ onOpenWaitlist }) => {
  const chapters = [
    {
      number: "01",
      tag: "THE SPARK",
      title: "The Broken Butter Knife",
      desc: "It was 7:15 AM on a chilly Tuesday morning. We were rushing to get breakfast ready before a big day. We opened a traditional jar of all-natural peanut butter only to be greeted by a thick, separated lake of oil on top. Grabbing a butter knife, we started stirring, only for oil to slosh onto the kitchen counter. Worse, when trying to spread the stiff peanut butter onto fresh artisan sourdough, the bread tore completely in half. That was the moment we said: Peanut butter needs to be completely rethought."
    },
    {
      number: "02",
      tag: "THE CRAFT",
      title: "50+ Roast Profiles & The Double-Mill",
      desc: "We didn't want to add palm oils or chemical emulsifiers to make peanut butter runny. Instead, we went back to food science fundamentals. We discovered that by precision-roasting premium golden peanuts at specific thermal curves and double-milling them at micrometric thresholds, the natural peanut oils stay naturally suspended in an ultra-silky, drizzleable state. The result? 100% pure peanuts with a texture that flows effortlessly."
    },
    {
      number: "03",
      tag: "THE INNOVATION",
      title: "The Silicone Anti-Drip Valve",
      desc: "A great formula needs an equally revolutionary delivery system. We tested dozens of dispensing caps before engineering our custom medical-grade silicone cross-slit valve. It creates an airtight seal that prevents oil leakage, dispenses precisely with gentle hand pressure, and cuts off cleanly with zero drips. No knives, no spoons, zero dishwashing."
    },
    {
      number: "04",
      tag: "THE HARVEST",
      title: "Single-Origin Ingredients Only",
      desc: "From farm to squeeze, we partner directly with sustainable peanut growers in the fertile soils of Gujarat and certified smallholder cocoa producers in West Africa. We add only a pinch of mineral-rich pink Himalayan salt. No fillers, no palm oil, no compromises."
    }
  ];

  return (
    <div className="py-12 md:py-24 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title="Our Story — The Journey of SQIZZY Squeeze Peanut Butter"
        description="Discover how a frustrating morning with a broken knife sparked the creation of Sqizzy squeeze peanut butter."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
            Editorial Brand Story
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-[#29150B] mt-3 leading-tight">
            FROM A BROKEN KNIFE TO A GOLDEN DRIZZLE.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#785A48] leading-relaxed">
            The obsessive pursuit of the cleanest, smoothest, most joyful peanut butter experience on earth.
          </p>
        </div>

        {/* Story Chapters */}
        <div className="space-y-16 sm:space-y-24">
          {chapters.map((ch, idx) => (
            <motion.div
              key={ch.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-16 border-b border-[#E8DCCF]"
            >
              <div className="lg:col-span-3">
                <span className="text-4xl sm:text-5xl font-mono font-black text-[#D97706]/40">
                  {ch.number}
                </span>
                <span className="block text-xs font-mono font-bold uppercase tracking-wider text-[#D97706] mt-1">
                  {ch.tag}
                </span>
              </div>

              <div className="lg:col-span-9 space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[#29150B]">
                  {ch.title}
                </h2>
                <p className="text-sm sm:text-base text-[#785A48] leading-relaxed font-normal">
                  {ch.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Showcase Interlude */}
        <div className="my-20 p-8 sm:p-12 rounded-3xl bg-[#29150B] text-[#FFFBEB] text-center relative overflow-hidden shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
            The Finished Product
          </span>
          <h3 className="text-2xl sm:text-4xl font-display font-black mt-2">
            SHAKE. SQUEEZE. DRIZZLE. DONE.
          </h3>
          
          <div className="py-8 flex justify-center">
            <SqizzyBottle size="md" flavor="Original Roasted" interactive={true} />
          </div>

          <p className="text-sm text-[#E8DCCF]/80 max-w-md mx-auto">
            Ready to be part of the very first Sqizzy production batch?
          </p>

          <button
            onClick={() => onOpenWaitlist('All Flavors')}
            className="mt-6 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#29150B]" />
            <span>JOIN THE VIP PRE-LAUNCH LIST</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
