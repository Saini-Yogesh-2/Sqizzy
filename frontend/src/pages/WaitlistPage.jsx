import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Gift, Zap, Bell, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SEO } from '../components/common/SEO';
import { joinWaitlist } from '../services/api';
import { trackWaitlistSubmit } from '../analytics/tracker';

export const WaitlistPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [flavor, setFlavor] = useState('All Flavors');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const perks = [
    { icon: <Zap className="w-5 h-5 text-[#F59E0B]" />, title: "Day 1 Batch Allocation", desc: "First dibs on limited production runs before public marketplace listing." },
    { icon: <Gift className="w-5 h-5 text-[#EA580C]" />, title: "20% Launch Discount Code", desc: "Exclusive pre-launch subscriber pricing delivered straight to your email." },
    { icon: <Star className="w-5 h-5 text-[#D97706]" />, title: "Vote on Future Flavors", desc: "Shape upcoming seasonal flavors (like Salted Caramel & Spicy Thai Peanut)." },
    { icon: <Bell className="w-5 h-5 text-[#10B981]" />, title: "Zero Spam Promise", desc: "Only high-impact production drops and release date announcements." }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await joinWaitlist({
        email,
        name,
        city,
        productInterest: flavor,
        source: 'dedicated_waitlist_page'
      });

      setSubmitted(true);
      trackWaitlistSubmit(email, flavor);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#F97316', '#FEF3C7', '#29150B']
      });
    } catch (err) {
      setError(err.message || 'Error joining waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-24 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title="Join the VIP Waitlist — SQIZZY Squeeze Peanut Butter"
        description="Claim exclusive VIP access to the first batch of Sqizzy squeeze peanut butter."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold uppercase tracking-wider mb-4 border border-[#FDE68A]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Pre-Launch VIP Access</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-[#29150B]">
            BE FIRST IN LINE.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#785A48]">
            Lock in early-bird access to our inaugural batch of squeeze peanut butter.
          </p>
        </div>

        {/* Form & Perks Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-[#FFFBEB] rounded-3xl p-6 sm:p-8 border border-[#E8DCCF] shadow-sqizzy flex flex-col justify-center">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-[#29150B]">Reserve Your Spot</h2>
                
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                    Email Address <span className="text-[#D97706]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                      Name <span className="text-xs font-normal text-[#A88B77]">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                      City <span className="text-xs font-normal text-[#A88B77]">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Austin, TX"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                    Most Anticipated Flavor
                  </label>
                  <select
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                  >
                    <option value="All Flavors">All Flavors (Surprise Me!)</option>
                    <option value="Sqizzy Original Smooth">Sqizzy Original Smooth</option>
                    <option value="Sqizzy Signature Crunch">Sqizzy Signature Crunch</option>
                    <option value="Sqizzy Dark Cocoa Hazelnut">Sqizzy Dark Cocoa Hazelnut</option>
                    <option value="Sqizzy High Protein Boost">Sqizzy High Protein Boost</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#29150B] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>LOCK IN VIP SPOT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display font-black text-[#29150B]">
                  WELCOME TO THE SQIZZY VIP CLUB!
                </h3>
                <p className="text-sm text-[#785A48]">
                  You are officially on our private early-access list for <strong>{flavor}</strong>.
                </p>
              </div>
            )}
          </div>

          {/* VIP Perks */}
          <div className="lg:col-span-5 space-y-4">
            {perks.map((p, idx) => (
              <div key={idx} className="bg-[#FFFBEB] p-5 rounded-2xl border border-[#E8DCCF] flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#FEF3C7] flex-shrink-0">
                  {p.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#29150B]">{p.title}</h4>
                  <p className="text-xs text-[#785A48] mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
