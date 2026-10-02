import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, ShieldCheck, Zap, Droplet, Users, Award } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const AboutPage = ({ onOpenWaitlist }) => {
  const pillars = [
    {
      title: "Radical Convenience",
      desc: "Breakfast should be effortless. By eliminating messy knives and sticky jar scraping, Sqizzy makes high-protein peanut butter as quick as a 3-second squeeze.",
      icon: <Zap className="w-6 h-6 text-[#D97706]" />
    },
    {
      title: "100% Honest Nutrition",
      desc: "We never dilute our products with palm oil, high fructose corn syrup, or artificial binders. Every squeeze is pure slow-roasted peanuts, natural single-origin cocoa, and pink sea salt.",
      icon: <ShieldCheck className="w-6 h-6 text-[#10B981]" />
    },
    {
      title: "Zero Counter Mess",
      desc: "Our precision silicone cross-slit valve was engineered so peanut butter only flows when you apply pressure. Put the bottle back in the pantry with zero drips.",
      icon: <Droplet className="w-6 h-6 text-[#F59E0B]" />
    },
    {
      title: "Eco-Conscious Packaging",
      desc: "Our lightweight, 100% BPA-free recyclable squeeze bottles reduce food waste by 18% compared to heavy glass jars with unreachable corner residue.",
      icon: <Heart className="w-6 h-6 text-[#EA580C]" />
    }
  ];

  return (
    <div className="py-12 md:py-20 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title="About SQIZZY — Reimagining Daily Fuel"
        description="Learn about Sqizzy's mission to make delicious, all-natural peanut butter completely mess-free and effortless."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
            Our Purpose
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-[#29150B] mt-2">
            WHY WE BUILT SQIZZY
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#785A48] leading-relaxed">
            We believe the foods you love most shouldn't come with friction, sticky knuckles, or sink cleanup.
          </p>
        </div>

        {/* Story Intro Banner */}
        <div className="bg-[#29150B] text-[#FFFBEB] rounded-3xl p-8 sm:p-12 md:p-16 border border-[#3D2517] relative overflow-hidden mb-20 shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
              The Peanut Revolution
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mt-3 leading-tight">
              PEANUT BUTTER WAS STUCK IN 1895. <br />
              <span className="text-[#F59E0B]">SO WE BROKE THE MOLD.</span>
            </h2>
            <p className="mt-6 text-sm sm:text-base text-[#E8DCCF]/80 leading-relaxed">
              For over a century, peanut butter was trapped in rigid glass jars. You had to search for a clean knife, stir a messy layer of oil, tear your bread, and scrape greasy residue off your knuckles.
            </p>
            <p className="mt-4 text-sm sm:text-base text-[#E8DCCF]/80 leading-relaxed">
              Sqizzy was born to liberate peanut butter into a dynamic, joyful, drizzleable experience. 100% natural. Zero mess. Pure culinary pleasure.
            </p>

            <div className="mt-8">
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F59E0B] text-[#29150B] font-extrabold text-xs uppercase tracking-wider hover:bg-[#F97316] transition-all"
              >
                <span>Explore The Full Founder Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-[#29150B]">
              THE 4 SQIZZY PILLARS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((p, idx) => (
              <div 
                key={idx}
                className="bg-[#FFFBEB] p-8 rounded-3xl border border-[#E8DCCF] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center mb-6">
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#29150B]">{p.title}</h3>
                  <p className="text-sm text-[#785A48] mt-2 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 bg-[#FFFBEB] rounded-3xl border border-[#E8DCCF]">
          <h3 className="text-2xl sm:text-3xl font-display font-black text-[#29150B]">
            READY TO TASTE THE DIFFERENCE?
          </h3>
          <p className="mt-2 text-sm text-[#785A48]">
            Claim your early-bird spot on the pre-launch VIP waitlist.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => onOpenWaitlist('All Flavors')}
              className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-extrabold text-sm uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#29150B]" />
              <span>JOIN THE VIP WAITLIST</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
