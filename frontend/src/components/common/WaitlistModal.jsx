import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle, ArrowRight, ShieldCheck, Mail, User, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { joinWaitlist } from '../../services/api';
import { trackWaitlistSubmit } from '../../analytics/tracker';

export const WaitlistModal = ({ isOpen, onClose, defaultFlavor = 'All Flavors', source = 'modal' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [flavor, setFlavor] = useState(defaultFlavor);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
      if (defaultFlavor) setFlavor(defaultFlavor);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, defaultFlavor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await joinWaitlist({
        email,
        name,
        city,
        productInterest: flavor,
        source
      });

      setSuccess(true);
      setMessage(res.message || "You're in! You'll be the first to know when Sqizzy drops.");
      
      // Fire confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#F97316', '#FEF3C7', '#29150B']
      });

      trackWaitlistSubmit(email, flavor);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#140803]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#FFFBEB] text-[#29150B] rounded-3xl shadow-2xl border border-[#E8DCCF] overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FEF3C7] text-[#785A48] hover:text-[#29150B] hover:bg-[#FDE68A] flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {!success ? (
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-bold w-fit mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Pre-Launch VIP Access</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#29150B]">
                BE FIRST TO DRIZZLE.
              </h3>
              <p className="mt-2 text-sm text-[#785A48]">
                Sqizzy is currently in final production runs. Join the early-access list to claim exclusive pre-launch batches and limited flavor drops.
              </p>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                    Email Address <span className="text-[#D97706]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A88B77] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                      Your Name <span className="text-xs font-normal text-[#A88B77]">(optional)</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#A88B77] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="Alex"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                      Your City <span className="text-xs font-normal text-[#A88B77]">(optional)</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#A88B77] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="New York, NY"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                    Which Flavor Are You Most Excited For?
                  </label>
                  <select
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
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
                  className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#29150B] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Claim VIP Early Access</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A88B77] pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>No spam. Only high-priority batch notifications.</span>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-[#D97706]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-[#29150B]">
                YOU'RE ON THE LIST!
              </h3>
              <p className="mt-3 text-sm text-[#785A48] max-w-sm mx-auto">
                {message}
              </p>
              <div className="mt-6 p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#785A48]">
                <p className="font-bold text-[#29150B]">Preferred Choice:</p>
                <p className="mt-0.5">{flavor}</p>
              </div>
              <button
                onClick={onClose}
                className="mt-6 py-3 px-8 rounded-xl bg-[#29150B] text-[#FFFBEB] font-bold text-sm hover:bg-[#3D1C06] transition-colors"
              >
                Continue Exploring
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
