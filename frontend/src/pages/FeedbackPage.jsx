import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, CheckCircle2, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SEO } from '../components/common/SEO';
import { submitFeedback } from '../services/api';
import { trackFeedbackOpen, trackFeedbackSubmit } from '../analytics/tracker';

export const FeedbackPage = () => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [favoriteFlavor, setFavoriteFlavor] = useState('Sqizzy Original Smooth');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    trackFeedbackOpen();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please provide a short feedback note.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitFeedback({
        rating,
        feedback,
        favoriteFlavor,
        name,
        email,
        ageRange
      });

      setSubmitted(true);
      trackFeedbackSubmit(rating);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#F97316', '#FEF3C7']
      });
    } catch (err) {
      setError(err.message || 'Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title="Share Your Feedback — SQIZZY"
        description="Help us shape the future of Sqizzy squeeze peanut butter. Tell us your thoughts, desired flavors, and breakfast routines."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
            Community Voice
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#29150B] mt-2">
            HELP US SHAPE SQIZZY
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#785A48] max-w-lg mx-auto">
            We are refining recipes, nozzle flow dynamics, and flavor blends before commercial launch. Your input directly influences our product.
          </p>
        </div>

        {/* Feedback Form Card */}
        <div className="bg-[#FFFBEB] rounded-3xl p-6 sm:p-10 border border-[#E8DCCF] shadow-sqizzy">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating */}
              <div className="text-center py-4 bg-white rounded-2xl border border-[#E8DCCF]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-3">
                  How excited are you about squeeze peanut butter? <span className="text-[#D97706]">*</span>
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-[#F59E0B] fill-[#F59E0B]'
                            : 'text-[#E8DCCF]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="block text-xs font-bold text-[#D97706] mt-2">
                  {rating === 5 && '🔥 Absolutely Need This!'}
                  {rating === 4 && '✨ Very Excited'}
                  {rating === 3 && '👍 Sounds Cool'}
                  {rating === 2 && '🤔 Curious'}
                  {rating === 1 && '🤷‍♂️ Not Sure Yet'}
                </span>
              </div>

              {/* Required Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-2">
                  What would make Sqizzy the perfect peanut butter for you? <span className="text-[#D97706]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you look for in peanut butter, favorite flavor ideas, or packaging thoughts..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
                />
              </div>

              {/* Flavor Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-2">
                  Which flavor are you most drawn to?
                </label>
                <select
                  value={favoriteFlavor}
                  onChange={(e) => setFavoriteFlavor(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] focus:outline-none focus:ring-2 focus:ring-[#D97706] transition-all"
                >
                  <option value="Sqizzy Original Smooth">Sqizzy Original Smooth</option>
                  <option value="Sqizzy Signature Crunch">Sqizzy Signature Crunch</option>
                  <option value="Sqizzy Dark Cocoa Hazelnut">Sqizzy Dark Cocoa Hazelnut</option>
                  <option value="Sqizzy High Protein Boost">Sqizzy High Protein Boost</option>
                  <option value="Other / New Flavor Idea">Other (I have a unique flavor idea)</option>
                </select>
              </div>

              {/* Optional Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                    Your Name <span className="text-xs font-normal text-[#A88B77]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Jane"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#785A48] mb-1.5">
                    Email <span className="text-xs font-normal text-[#A88B77]">(optional, to stay in touch)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-[#E8DCCF] text-sm text-[#29150B] placeholder-[#A88B77] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#29150B] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>SUBMIT YOUR FEEDBACK</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                THANKS FOR MAKING SQIZZY BETTER!
              </h2>
              <p className="text-sm sm:text-base text-[#785A48] max-w-md mx-auto">
                Your feedback has been delivered straight to our recipe and product development team.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFeedback('');
                  }}
                  className="py-2.5 px-6 rounded-xl bg-[#29150B] text-[#FFFBEB] text-xs font-bold uppercase tracking-wider hover:bg-[#3D1C06]"
                >
                  Submit Another Thought
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
