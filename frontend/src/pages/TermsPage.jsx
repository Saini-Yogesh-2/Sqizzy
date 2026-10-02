import React from 'react';
import { SEO } from '../components/common/SEO';

export const TermsPage = () => {
  return (
    <div className="py-12 md:py-20 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title="Terms of Service — SQIZZY" 
        description="Terms of Service for SQIZZY pre-launch website."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-[#E8DCCF] pb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
            Legal Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#29150B] mt-2">
            TERMS OF SERVICE
          </h1>
          <p className="mt-2 text-xs font-mono text-[#785A48]">
            Effective Date: October 2026 • Pre-Launch Stage
          </p>
        </div>

        <div className="bg-[#FFFBEB] rounded-3xl p-6 sm:p-10 border border-[#E8DCCF] space-y-8 text-sm text-[#29150B] leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">1. Pre-Launch Nature of Service</h2>
            <p className="text-[#785A48]">
              The SQIZZY website (sqizzy.co) is currently operating as a pre-launch brand showcase and consumer interest measurement platform. At this stage, NO commercial transactions, checkouts, or order processing occur through this website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">2. Product Descriptions & Informational Estimates</h2>
            <p className="text-[#785A48]">
              Product imagery, packaging renders, flavor descriptions, and nutritional panels are presented for conceptual and pre-launch informational purposes. Actual final packaging and laboratory-verified nutritional values will be provided at commercial release.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">3. VIP Waitlist Policy</h2>
            <p className="text-[#785A48]">
              Joining our VIP waitlist is free of charge and does not constitute a legally binding purchase contract or guaranteed product allocation. Waitlist members will be provided notification and first opportunity to purchase once production opens.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">4. Intellectual Property</h2>
            <p className="text-[#785A48]">
              All brand assets, original trademarks, logos, typography, visual layouts, packaging concepts, and website software are the intellectual property of SQIZZY Foods Inc.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">5. Governing Law</h2>
            <p className="text-[#785A48]">
              These terms are governed by and construed in accordance with applicable laws. For questions regarding these terms, contact legal@sqizzy.co.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
