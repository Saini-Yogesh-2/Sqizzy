import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const AnnouncementBar = ({ onWaitlistClick }) => {
  return (
    <div className="bg-[#29150B] text-[#FFFBEB] text-xs font-semibold py-2 px-4 text-center relative z-40 border-b border-[#3D2517] overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0 animate-spin" />
        <span className="truncate">
          <span className="font-bold text-[#F59E0B] uppercase tracking-wider">SQIZZY IS COMING SOON</span> — Be first in line for the cleanest squeeze
        </span>
        <button
          onClick={onWaitlistClick}
          className="inline-flex items-center gap-1 font-bold text-[#F59E0B] hover:text-[#F97316] underline underline-offset-2 ml-1 text-xs cursor-pointer flex-shrink-0"
        >
          <span>Join VIP Waitlist</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
