import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ArrowRight, CheckCircle2, Building, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { submitContact } from '../services/api';
import { trackContactSubmit } from '../analytics/tracker';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitContact({ name, email, topic, message });
      setSubmitted(true);
      trackContactSubmit();
    } catch (err) {
      setError(err.message || 'Error submitting message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title="Contact SQIZZY — Get in Touch" 
        description="Have questions regarding wholesale, partnerships, or the Sqizzy pre-launch? Send us a message."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#29150B] mt-2">
            WE'D LOVE TO HEAR FROM YOU
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#785A48]">
            Whether you are a retailer interested in stocking Sqizzy, a creator looking to collaborate, or a peanut butter enthusiast.
          </p>
        </div>

        <div className="bg-[#FFFBEB] rounded-3xl p-6 sm:p-10 border border-[#E8DCCF] shadow-sqizzy">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                    Your Name <span className="text-[#D97706]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jordan Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                    Email Address <span className="text-[#D97706]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                  Topic of Inquiry
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                >
                  <option value="General Inquiry">General Question or Feedback</option>
                  <option value="Retail & Wholesale">Wholesale & Retail Stocking</option>
                  <option value="Press & Media">Press, Media & Collaborations</option>
                  <option value="Packaging & Supply">Supply Chain & Sustainability</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                  Your Message <span className="text-[#D97706]">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#29150B] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-[#29150B]">
                MESSAGE RECEIVED!
              </h2>
              <p className="text-sm text-[#785A48] max-w-md mx-auto">
                Thanks for reaching out. Our brand team will get back to your email within 24-48 business hours.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
