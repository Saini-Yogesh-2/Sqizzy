import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Home, Search } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const NotFoundPage = () => {
  return (
    <div className="py-20 md:py-32 bg-[#FDF8F0] min-h-screen flex items-center justify-center">
      <SEO 
        title="404 — Looks Like This Jar Is Empty | SQIZZY" 
        description="Page not found on SQIZZY."
      />

      <div className="max-w-xl mx-auto px-4 text-center">
        
        <div className="w-24 h-24 rounded-full bg-[#FEF3C7] border-2 border-[#FDE68A] flex items-center justify-center mx-auto mb-6 shadow-md">
          <span className="font-mono text-3xl font-black text-[#D97706]">404</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-[#29150B]">
          LOOKS LIKE THIS JAR IS EMPTY.
        </h1>

        <p className="mt-3 text-base text-[#785A48] max-w-md mx-auto">
          We couldn't find the page you're searching for. It might have been squeezed away or moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#29150B] text-[#FFFBEB] font-extrabold text-xs uppercase tracking-wider hover:bg-[#3D1C06] transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>GO HOME</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#FFFBEB] border border-[#E8DCCF] text-[#29150B] font-bold text-xs uppercase tracking-wider hover:bg-[#FEF3C7] transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-[#D97706]" />
            <span>EXPLORE SQIZZY</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
