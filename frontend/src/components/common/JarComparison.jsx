import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, CheckCircle2, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { SqizzyBottle } from './SqizzyBottle';

export const JarComparison = ({ onWaitlistClick }) => {
  const [activeTab, setActiveTab] = useState('sqizzy'); // 'sqizzy' | 'traditional'

  const traditionalIssues = [
    { title: "Aggravating Oil Separation", desc: "Forced to stir an oily pool with a knife, sloshing oil all over your counter and hands." },
    { title: "The Broken Bread Tragedy", desc: "Cold, stiff peanut butter tearing your delicate warm sourdough or fluffy toast." },
    { title: "Sticky Knuckles & Jar Graves", desc: "Reaching deep into narrow jar corners leaves sticky residue all over your knuckles." },
    { title: "Messy Silverware Cleanup", desc: "Dirty knives and spoons piling up in the sink after every single snack." }
  ];

  const sqizzyBenefits = [
    { title: "Instant Shake & Drizzle", desc: "Silky, naturally emulsion-stabilized peanut butter flows smoothly with just a 3-second shake." },
    { title: "Silicone Anti-Drip Valve", desc: "Zero drips, zero leaks, and precision flow control right onto your toast or smoothie." },
    { title: "Zero Sticky Knuckles", desc: "Contoured squeeze bottle empties down to the last drop with zero reaching or scraping." },
    { title: "Zero Dirty Cutlery", desc: "Dispense directly from bottle to food. No knives, no spoons, zero dishwashing hassle." }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#29150B] text-[#FFFBEB] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-[#F97316]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D1F10] border border-[#F59E0B]/30 text-[#F59E0B] text-xs md:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Goodbye Sticky Jars</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight"
          >
            PEANUT BUTTER, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#F97316] to-[#FEF3C7]">
              WITHOUT THE BATTLE.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-[#E8DCCF]/80 max-w-2xl mx-auto"
          >
            We loved peanut butter. We hated the outdated 19th-century jar. Here is how Sqizzy re-engineered the entire morning routine.
          </motion.p>
        </div>

        {/* Interactive Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Traditional Jar Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#1C0D06] rounded-3xl p-6 sm:p-8 md:p-10 border border-[#3D2517] relative overflow-hidden group hover:border-[#78350F] transition-all"
          >
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#3D2517]">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A88B77]">The Old Way</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#E8DCCF]">Traditional Jar</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400">
                <XCircle className="w-7 h-7" />
              </div>
            </div>

            {/* Traditional Jar Diagram Graphic */}
            <div className="my-6 p-6 rounded-2xl bg-[#140803] flex items-center justify-center border border-[#2B140A]">
              <div className="flex items-center gap-4 text-center">
                <div className="w-20 h-24 border-2 border-dashed border-[#785A48] rounded-xl flex flex-col items-center justify-center p-2 opacity-60">
                  <div className="w-full h-3 bg-[#D97706]/40 rounded mb-1"></div>
                  <span className="text-[10px] text-[#A88B77] font-mono">Separated Oil</span>
                  <div className="w-full h-8 bg-[#5B290B] rounded mt-2"></div>
                </div>
                <div className="text-left text-xs text-[#A88B77] space-y-1">
                  <p className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> Requires messy knife stir
                  </p>
                  <p>• Knife blade snaps soft bread</p>
                  <p>• 15% wasted at jar bottom</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {traditionalIssues.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <XCircle className="w-5 h-5 text-red-400/80 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#E8DCCF]">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-[#A88B77] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SQIZZY Squeeze Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#3D1F10] to-[#241107] rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-[#F59E0B]/40 relative overflow-hidden shadow-2xl shadow-[#D97706]/10"
          >
            {/* Best Innovation Badge */}
            <div className="absolute -top-3 right-8 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#29150B] font-black text-xs px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">
              The Modern Standard
            </div>

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#5B290B]">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B]">The Sqizzy Way</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#FFFBEB]">Sqizzy Squeeze</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#D97706]/20 border border-[#F59E0B]/50 flex items-center justify-center text-[#F59E0B]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            </div>

            {/* 3D Bottle Squeeze Visual */}
            <div className="my-6 p-4 rounded-2xl bg-[#1A0B04] border border-[#F59E0B]/20 flex items-center justify-center">
              <div className="flex items-center gap-6">
                <SqizzyBottle size="sm" interactive={false} />
                <div className="text-left text-xs text-[#E8DCCF] space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#D97706]/20 text-[#F59E0B] font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> SHAKE • SQUEEZE • DRIZZLE
                  </div>
                  <p className="text-[#FEF3C7] font-medium">1. Shake bottle for 3 seconds</p>
                  <p className="text-[#FEF3C7] font-medium">2. Squeeze precision nozzle</p>
                  <p className="text-[#FEF3C7] font-medium">3. Enjoy zero cleanup</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {sqizzyBenefits.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#FFFBEB]">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-[#E8DCCF]/80 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA in Card */}
            <div className="mt-8 pt-6 border-t border-[#5B290B]">
              <button
                onClick={onWaitlistClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Join The Sqizzy Revolution</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
