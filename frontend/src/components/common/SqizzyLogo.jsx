import React from 'react';
import { Link } from 'react-router-dom';

export const SqizzyLogo = ({ className = '', size = 'md', isDark = false }) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl md:text-6xl',
  };

  return (
    <Link 
      to="/" 
      className={`inline-flex items-center gap-2 font-black tracking-tight select-none group transition-transform active:scale-95 ${className}`}
      aria-label="SQIZZY Peanut Butter Homepage"
    >
      <div className="relative flex items-center justify-center">
        {/* Dynamic Drizzle Nut Icon */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] p-0.5 shadow-md group-hover:rotate-6 transition-transform duration-300">
          <div className="w-full h-full bg-[#29150B] rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path 
                d="M12 3C8 10 5 13.5 5 17C5 20.3137 7.68629 23 11 23C14.3137 23 17 20.3137 17 17C17 13.5 14 10 12 3Z" 
                fill="#F59E0B"
              />
              <path 
                d="M12 6C9.5 11.5 7 14 7 17C7 19.2091 8.79086 21 11 21C13.2091 21 15 19.2091 15 17C15 14 12.5 11.5 12 6Z" 
                fill="#D97706"
              />
              <path 
                d="M8.5 16C8.5 16 9.5 19 13.5 19" 
                stroke="#FFFBEB" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#F97316] rounded-full blur-[2px] opacity-70"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-display font-black tracking-tighter uppercase ${sizeClasses[size] || sizeClasses.md} ${isDark ? 'text-white' : 'text-[#29150B]'}`}>
          SQIZZY<span className="text-[#D97706] inline-block group-hover:scale-125 transition-transform duration-300">.</span>
        </span>
      </div>
    </Link>
  );
};
