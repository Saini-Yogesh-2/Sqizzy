import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const SqizzyBottle = ({
  flavor = "Original Roasted",
  accentColor = "#D97706",
  tagline = "The Everyday Golden Squeeze",
  badge = "100% Peanuts",
  className = "",
  interactive = true,
  size = "lg" // sm, md, lg, hero
}) => {
  const [isSqueezed, setIsSqueezed] = useState(false);

  const sizeStyles = {
    sm: "w-36 h-64",
    md: "w-48 h-80",
    lg: "w-64 h-[26rem]",
    hero: "w-72 sm:w-80 md:w-96 h-[30rem] md:h-[34rem]"
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Interactive Squeeze Hint */}
      {interactive && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-7 px-3 py-1 bg-[#29150B] text-[#FFFBEB] text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer z-20 border border-[#F59E0B]/30"
          onClick={() => setIsSqueezed(true)}
        >
          <Sparkles className="w-3 h-3 text-[#F59E0B] animate-spin" />
          <span>Tap to Squeeze</span>
        </motion.div>
      )}

      {/* Bottle Container with Dynamic Spring Animation */}
      <motion.div
        animate={isSqueezed ? { scaleX: 0.88, scaleY: 1.04, rotate: [-1, 2, -1, 0] } : { scaleX: 1, scaleY: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        onHoverStart={() => interactive && setIsSqueezed(true)}
        onHoverEnd={() => interactive && setIsSqueezed(false)}
        onClick={() => {
          if (interactive) {
            setIsSqueezed(true);
            setTimeout(() => setIsSqueezed(false), 600);
          }
        }}
        className={`relative ${sizeStyles[size] || sizeStyles.lg} cursor-pointer group flex flex-col items-center justify-center drop-shadow-2xl`}
      >
        {/* Ambient Glow */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
          style={{ backgroundColor: accentColor }}
        ></div>

        {/* 3D SVG Bottle Model */}
        <svg
          viewBox="0 0 260 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_25px_35px_rgba(41,21,11,0.25)] transition-transform duration-300 group-hover:scale-105"
        >
          {/* Defs / Gradients */}
          <defs>
            {/* Bottle Plastic Matte Gradient */}
            <linearGradient id="bottleShine" x1="0" y1="0" x2="260" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.4"/>
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.9"/>
              <stop offset="50%" stopColor="#FEF3C7" stopOpacity="0.5"/>
              <stop offset="85%" stopColor="#D97706" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#29150B" stopOpacity="0.35"/>
            </linearGradient>

            {/* Peanut Butter Internal Liquid Gradient */}
            <linearGradient id="pbGradient" x1="0" y1="0" x2="260" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B"/>
              <stop offset="45%" stopColor={accentColor}/>
              <stop offset="100%" stopColor="#78350F"/>
            </linearGradient>

            {/* Cap Gradient */}
            <linearGradient id="capGradient" x1="60" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3D1C06"/>
              <stop offset="40%" stopColor="#5B290B"/>
              <stop offset="100%" stopColor="#1B0C04"/>
            </linearGradient>

            {/* Label Shadow */}
            <filter id="labelShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2"/>
            </filter>
          </defs>

          {/* Precision Dispenser Cap (Bottom inverted style) */}
          <rect x="75" y="420" width="110" height="35" rx="10" fill="url(#capGradient)" stroke="#190B05" strokeWidth="2"/>
          {/* Cap Ribbing */}
          <line x1="90" y1="425" x2="90" y2="450" stroke="#78350F" strokeWidth="2"/>
          <line x1="105" y1="425" x2="105" y2="450" stroke="#78350F" strokeWidth="2"/>
          <line x1="120" y1="425" x2="120" y2="450" stroke="#78350F" strokeWidth="2"/>
          <line x1="135" y1="425" x2="135" y2="450" stroke="#78350F" strokeWidth="2"/>
          <line x1="150" y1="425" x2="150" y2="450" stroke="#78350F" strokeWidth="2"/>
          <line x1="165" y1="425" x2="165" y2="450" stroke="#78350F" strokeWidth="2"/>
          
          {/* Anti-Drip Silicone Nozzle Tip */}
          <ellipse cx="130" cy="455" rx="20" ry="6" fill="#EA580C" stroke="#29150B" strokeWidth="1.5"/>
          <circle cx="130" cy="455" r="3" fill="#29150B"/>

          {/* Main Ergonomic Bottle Silhouette (Squeeze hourglass curve) */}
          <path
            d="M 65,40 
               C 50,70 35,140 38,220 
               C 40,280 50,340 55,390 
               C 58,415 80,422 130,422 
               C 180,422 202,415 205,390 
               C 210,340 220,280 222,220 
               C 225,140 210,70 195,40 
               C 180,15 155,10 130,10 
               C 105,10 80,15 65,40 Z"
            fill="url(#pbGradient)"
          />

          {/* Frosted Translucent Bottle Shell / Highlight */}
          <path
            d="M 65,40 
               C 50,70 35,140 38,220 
               C 40,280 50,340 55,390 
               C 58,415 80,422 130,422 
               C 180,422 202,415 205,390 
               C 210,340 220,280 222,220 
               C 225,140 210,70 195,40 
               C 180,15 155,10 130,10 
               C 105,10 80,15 65,40 Z"
            fill="url(#bottleShine)"
            stroke="#FEF3C7"
            strokeWidth="3"
            strokeOpacity="0.6"
          />

          {/* Ergonomic Finger Grip Indent Grooves (Left & Right) */}
          <path d="M 45 180 Q 52 210 46 240" stroke="#78350F" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4"/>
          <path d="M 47 160 Q 54 185 48 210" stroke="#FFFBEB" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
          
          <path d="M 215 180 Q 208 210 214 240" stroke="#78350F" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4"/>
          <path d="M 213 160 Q 206 185 212 210" stroke="#FFFBEB" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>

          {/* Premium Matte Brand Wrap Label */}
          <g filter="url(#labelShadow)">
            <rect x="44" y="100" width="172" height="240" rx="20" fill="#29150B" stroke="#F59E0B" strokeWidth="2"/>
            
            {/* Label Background Accent Band */}
            <path d="M 44 100 L 216 100 L 216 135 L 44 145 Z" fill={accentColor} opacity="0.9"/>
            
            {/* Brand Emblem */}
            <circle cx="130" cy="140" r="22" fill="#FFFBEB" stroke="#D97706" strokeWidth="2.5"/>
            <path d="M 130 126 C 124 134 120 138 120 142 C 120 146 124 150 130 150 C 136 150 140 146 140 142 C 140 138 136 134 130 126 Z" fill="#D97706"/>
            
            {/* Brand Typography */}
            <text x="130" y="190" textAnchor="middle" fill="#FFFBEB" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="28" letterSpacing="1">
              SQIZZY
            </text>
            
            {/* Flavor Tagline */}
            <text x="130" y="212" textAnchor="middle" fill="#F59E0B" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="11" letterSpacing="2">
              {flavor.toUpperCase()}
            </text>
            
            {/* Divider Line */}
            <line x1="75" y1="228" x2="185" y2="228" stroke="#785A48" strokeWidth="1" strokeDasharray="3 3"/>
            
            {/* Clean Claims Badges */}
            <rect x="65" y="240" width="130" height="22" rx="6" fill="#3D1F10" stroke="#D97706" strokeWidth="1"/>
            <text x="130" y="255" textAnchor="middle" fill="#FEF3C7" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="10">
              SHAKE • SQUEEZE • DRIZZLE
            </text>

            <rect x="75" y="270" width="110" height="18" rx="4" fill="#F59E0B"/>
            <text x="130" y="283" textAnchor="middle" fill="#29150B" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="9">
              {badge.toUpperCase()}
            </text>

            <text x="130" y="315" textAnchor="middle" fill="#A88B77" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="500" fontSize="9">
              NET WT. 375g (13.2 OZ)
            </text>
          </g>

          {/* Left Vertical Gloss Reflection */}
          <path
            d="M 60 70 C 50 120 48 180 50 250 C 52 300 58 350 62 380"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Dynamic Drizzle Stream Animation on Squeeze */}
        {isSqueezed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 90, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -bottom-20 w-4 rounded-full shadow-lg z-30 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, #D97706, ${accentColor}, #B45309)`
            }}
          >
            <motion.div 
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-6 h-6 rounded-full bg-[#D97706] absolute -bottom-3 -left-1 shadow-md border-2 border-[#FEF3C7]"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
