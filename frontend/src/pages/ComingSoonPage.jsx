import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { SqizzyBottle } from '../components/common/SqizzyBottle';

export const ComingSoonPage = ({ onOpenWaitlist }) => {
  return (
    <div className="py-16 md:py-24 bg-[#FDF8F0] min-h-screen flex items-center justify-center">
      <SEO 
        title="Coming Soon — SQIZZY Squeeze Peanut Butter" 
        description="Sqizzy is currently completing initial production batches. Join the VIP waitlist for first access."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="bg-[#FFFBEB] rounded-3xl p-8 sm:p-14 border border-[#E8DCCF] shadow-sqizzy relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold uppercase tracking-wider mb-6 border border-[#FDE68A]">
            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Pilot Batch In Production</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-[#29150B] leading-tight">
            SQIZZY IS COMING SOON.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#785A48] max-w-xl mx-auto">
            We are fine-tuning our Gujarat peanut roast curves and precision silicone valve dispensers. We're launching soon.
          </p>

          <div className="py-8 flex justify-center">
            <SqizzyBottle size="md" flavor="Original Roasted" interactive={true} />
          </div>

          <div className="pt-4 max-w-md mx-auto space-y-4">
            <button
              onClick={() => onOpenWaitlist('All Flavors')}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#29150B]" />
              <span>JOIN VIP WAITLIST FOR LAUNCH DAY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="block text-center text-xs font-bold text-[#785A48] hover:text-[#D97706] py-1"
            >
              ← Explore The 4 Launch Flavors
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
