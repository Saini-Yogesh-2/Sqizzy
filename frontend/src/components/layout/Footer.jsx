import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Instagram, Twitter, Facebook, Youtube, ShieldCheck, Heart } from 'lucide-react';
import { SqizzyLogo } from '../common/SqizzyLogo';
import { joinWaitlist } from '../../services/api';
import { trackWaitlistSubmit } from '../../analytics/tracker';

export const Footer = ({ onOpenWaitlist }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await joinWaitlist({ email, source: 'footer_newsletter' });
      setSubscribed(true);
      trackWaitlistSubmit(email, 'All Flavors');
    } catch (e) {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#190B05] text-[#FFFBEB] pt-20 pb-12 border-t border-[#29150B] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#3D2517]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <SqizzyLogo size="lg" isDark={true} />
            <p className="text-[#A88B77] text-sm leading-relaxed max-w-sm">
              The modern peanut butter designed for clean drizzling. 100% slow-roasted peanuts, zero stirring, and an anti-drip precision nozzle.
            </p>

            {/* Newsletter / Waitlist Signup */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-2">
                Join the VIP Pre-Launch List
              </span>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-l-xl bg-[#29150B] border border-[#5B290B] text-sm text-[#FFFBEB] placeholder-[#785A48] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 rounded-r-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#29150B] font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
                    aria-label="Subscribe to waitlist"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#29150B] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-3 rounded-xl bg-[#29150B] border border-[#F59E0B]/30 text-xs text-[#F59E0B] font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>You're on the list! Watch your inbox.</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-bold mb-4">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-[#E8DCCF]/80">
              <li><Link to="/products" className="hover:text-[#F59E0B] transition-colors">The Sqizzy Range</Link></li>
              <li><Link to="/products/sqizzy-original-smooth" className="hover:text-[#F59E0B] transition-colors">Original Smooth</Link></li>
              <li><Link to="/products/sqizzy-signature-crunch" className="hover:text-[#F59E0B] transition-colors">Signature Crunch</Link></li>
              <li><Link to="/products/sqizzy-dark-cocoa-hazelnut" className="hover:text-[#F59E0B] transition-colors">Dark Cocoa Hazelnut</Link></li>
              <li><Link to="/products/sqizzy-high-protein-boost" className="hover:text-[#F59E0B] transition-colors">High Protein Boost</Link></li>
            </ul>
          </div>

          {/* Column 2: Brand & Story */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-bold mb-4">
              Our World
            </h4>
            <ul className="space-y-3 text-sm text-[#E8DCCF]/80">
              <li><Link to="/our-story" className="hover:text-[#F59E0B] transition-colors">Our Story</Link></li>
              <li><Link to="/about" className="hover:text-[#F59E0B] transition-colors">About Sqizzy</Link></li>
              <li><Link to="/faq" className="hover:text-[#F59E0B] transition-colors">Frequently Asked</Link></li>
              <li><Link to="/feedback" className="hover:text-[#F59E0B] transition-colors">Share Feedback</Link></li>
              <li><Link to="/contact" className="hover:text-[#F59E0B] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-bold mb-4">
              Transparency
            </h4>
            <ul className="space-y-3 text-sm text-[#E8DCCF]/80">
              <li><Link to="/privacy-policy" className="hover:text-[#F59E0B] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#F59E0B] transition-colors">Terms of Service</Link></li>
              <li><Link to="/coming-soon" className="hover:text-[#F59E0B] transition-colors">Launch Timeline</Link></li>
              <li><Link to="/waitlist" className="hover:text-[#F59E0B] transition-colors">VIP Waitlist</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#785A48]">
          <p>© 2026 SQIZZY Foods Inc. All rights reserved. Pre-launch product concept preview.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with pure peanut passion</span>
            <Heart className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
