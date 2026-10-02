import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SQUEEZE_SPRING = { type: 'spring', stiffness: 180, damping: 22, mass: 1.2 };
const RELEASE_SPRING = { type: 'spring', stiffness: 120, damping: 28, mass: 1.4 };

// 8 satellite droplets: direction & size
const SATS = [
  { dx: -42, dy:  4, rx: 6.5, ry: 3.5, delay: 0.00 },
  { dx:  44, dy:  3, rx: 7.0, ry: 3.5, delay: 0.03 },
  { dx: -26, dy: 24, rx: 5.5, ry: 3.0, delay: 0.07 },
  { dx:  30, dy: 22, rx: 5.0, ry: 3.0, delay: 0.05 },
  { dx: -54, dy: 27, rx: 4.0, ry: 2.5, delay: 0.12 },
  { dx:  56, dy: 22, rx: 4.0, ry: 2.5, delay: 0.10 },
  { dx:  -6, dy: 36, rx: 4.5, ry: 2.5, delay: 0.15 },
  { dx:  14, dy: 38, rx: 4.0, ry: 2.5, delay: 0.17 },
];

// ─────────────────────────────────────────────────────────────────────────────
// PeanutButterDrip — full physics-accurate viscous PB drop animation
// ─────────────────────────────────────────────────────────────────────────────
const PeanutButterDrip = ({ accent = '#D97706', size = 'hero', onDone }) => {
  const uid = accent.replace('#', '');

  const dripOffsets = {
    sm:   { bottom: '-62px',  scale: 0.52 },
    md:   { bottom: '-88px',  scale: 0.70 },
    lg:   { bottom: '-115px', scale: 0.85 },
    hero: { bottom: '-148px', scale: 1.00 },
  };

  const currentOffset = dripOffsets[size] || dripOffsets.hero;

  // All animation controllers (hook calls always at top level, always same count)
  const streamCtrl = useAnimation();
  const neckCtrl   = useAnimation();
  const blobCtrl   = useAnimation();
  const flashCtrl  = useAnimation();
  const puddleCtrl = useAnimation();
  const lobe1Ctrl  = useAnimation();
  const lobe2Ctrl  = useAnimation();
  const lobe3Ctrl  = useAnimation();
  const lobe4Ctrl  = useAnimation();
  const ring1Ctrl  = useAnimation();
  const ring2Ctrl  = useAnimation();
  const ring3Ctrl  = useAnimation();
  const shimCtrl   = useAnimation();
  const hlCtrl     = useAnimation();
  // Satellite drop controllers (8 — always same count)
  const s0 = useAnimation(); const s1 = useAnimation();
  const s2 = useAnimation(); const s3 = useAnimation();
  const s4 = useAnimation(); const s5 = useAnimation();
  const s6 = useAnimation(); const s7 = useAnimation();
  const satCtrls = [s0, s1, s2, s3, s4, s5, s6, s7];

  const CX = 80; // puddle center X in SVG units
  const CY = 126; // puddle center Y in SVG units

  useEffect(() => {
    let dead = false;

    const run = async () => {
      // ── Phase 1 ─ Stream pours from nozzle (grows downward) ──────────────
      streamCtrl.start({
        scaleY: 1, opacity: 1,
        transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
      });

      // Neck + blob start forming 200ms into stream pour
      await new Promise(r => setTimeout(r, 210));
      if (dead) return;

      // ── Phase 2 ─ Teardrop blob swells at tip of stream ──────────────────
      await blobCtrl.start({
        scaleX: 1, scaleY: 1, y: 0, opacity: 1,
        transition: { duration: 0.52, ease: [0.34, 1.35, 0.64, 1] },
      });
      if (dead) return;

      // ── Phase 3 ─ Neck pinches off (Rayleigh-Plateau instability) ─────────
      neckCtrl.start({
        scaleX: 0, scaleY: 0.3, opacity: 0,
        transition: { duration: 0.11, ease: 'easeIn' },
      });
      // Blob detaches and accelerates downward
      await blobCtrl.start({
        y: 22, scaleX: 1.18, scaleY: 1.12,
        transition: { type: 'spring', stiffness: 310, damping: 13 },
      });
      if (dead) return;

      // ── Phase 4 ─ IMPACT ─────────────────────────────────────────────────
      await Promise.all([
        // Stream retracts (sucked back up)
        streamCtrl.start({
          scaleY: 0, opacity: 0,
          transition: { duration: 0.13, ease: 'easeIn' },
        }),
        // Blob slams flat (violent inelastic impact)
        blobCtrl.start({
          scaleX: 4.2, scaleY: 0.16, y: 22,
          transition: { type: 'spring', stiffness: 380, damping: 13 },
        }),
        // Impact burst flash
        flashCtrl.start({
          scale: [0.2, 1.4, 0], opacity: [0, 0.85, 0],
          transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        }),
        // All satellite micro-drops fly out
        ...SATS.map((s, i) =>
          satCtrls[i].start({
            x: s.dx, y: s.dy,
            scaleX: [0.05, 1, 0.2],
            scaleY: [0.05, 1, 0.2],
            opacity: [0, 1, 0],
            transition: {
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
              delay: s.delay,
            },
          })
        ),
      ]);
      if (dead) return;

      // ── Phase 5 ─ Organic puddle expands (gooey multi-lobe shape) ─────────
      await Promise.all([
        puddleCtrl.start({
          scaleX: 1, scaleY: 1, opacity: 1,
          transition: { type: 'spring', stiffness: 125, damping: 19 },
        }),
        lobe1Ctrl.start({
          scaleX: 1, scaleY: 1, opacity: 0.93,
          transition: { duration: 0.58, ease: [0.34, 1.25, 0.64, 1], delay: 0.06 },
        }),
        lobe2Ctrl.start({
          scaleX: 1, scaleY: 1, opacity: 0.88,
          transition: { duration: 0.65, ease: [0.34, 1.25, 0.64, 1], delay: 0.11 },
        }),
        lobe3Ctrl.start({
          scaleX: 1, scaleY: 1, opacity: 0.82,
          transition: { duration: 0.60, ease: [0.34, 1.25, 0.64, 1], delay: 0.09 },
        }),
        lobe4Ctrl.start({
          scaleX: 1, scaleY: 1, opacity: 0.76,
          transition: { duration: 0.62, ease: [0.34, 1.25, 0.64, 1], delay: 0.13 },
        }),
        // Surface highlight appears
        hlCtrl.start({
          opacity: 0.18,
          transition: { duration: 0.5, delay: 0.3 },
        }),
      ]);
      if (dead) return;

      // ── Phase 6 ─ Ripple rings spread outward like viscous fluid ──────────
      ring1Ctrl.start({
        scale: [0.35, 3.4], opacity: [0.92, 0],
        transition: { duration: 1.05, ease: 'easeOut' },
      });
      ring2Ctrl.start({
        scale: [0.35, 4.2], opacity: [0.68, 0],
        transition: { duration: 1.3, ease: 'easeOut', delay: 0.16 },
      });
      ring3Ctrl.start({
        scale: [0.35, 5.0], opacity: [0.48, 0],
        transition: { duration: 1.6, ease: 'easeOut', delay: 0.32 },
      });

      // ── Phase 7 ─ Viscous glooping oscillation (puddle settles) ──────────
      await puddleCtrl.start({
        scaleX: [1, 1.16, 0.91, 1.10, 0.95, 1.04, 0.99, 1.0],
        scaleY: [1, 0.82, 1.12, 0.89, 1.07, 0.96, 1.02, 1.0],
        transition: { duration: 1.75, ease: 'easeInOut' },
      });
      if (dead) return;

      // ── Phase 8 ─ Shimmer sweep across puddle surface ─────────────────────
      await shimCtrl.start({
        x: [0, 80], opacity: [0, 0.75, 0],
        transition: { duration: 0.85, ease: 'easeInOut' },
      });
      if (dead) return;

      // ── Phase 9 ─ Fade everything out ────────────────────────────────────
      await new Promise(r => setTimeout(r, 280));
      await Promise.all([
        puddleCtrl.start({
          opacity: 0, scaleY: 0.38,
          transition: { duration: 0.6, ease: 'easeIn' },
        }),
        lobe1Ctrl.start({ opacity: 0, transition: { duration: 0.42 } }),
        lobe2Ctrl.start({ opacity: 0, transition: { duration: 0.45 } }),
        lobe3Ctrl.start({ opacity: 0, transition: { duration: 0.40 } }),
        lobe4Ctrl.start({ opacity: 0, transition: { duration: 0.38 } }),
        blobCtrl.start({ opacity: 0, transition: { duration: 0.52 } }),
        hlCtrl.start({ opacity: 0, transition: { duration: 0.35 } }),
      ]);

      if (!dead && onDone) onDone();
    };

    run();
    return () => { dead = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dark = '#78350F';
  const mid  = accent;
  const lite = '#FBBF24';

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        bottom: currentOffset.bottom,
        left: '50%',
        transform: `translateX(-50%) scale(${currentOffset.scale})`,
        transformOrigin: 'top center',
        width: '190px',
        height: '195px',
      }}
    >
      <svg
        viewBox="0 0 160 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* ── Gradients ─────────────────────────────────────────────── */}
          <linearGradient id={`sg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={lite} />
            <stop offset="45%"  stopColor={mid}  />
            <stop offset="100%" stopColor={dark} />
          </linearGradient>

          <radialGradient id={`blg-${uid}`} cx="36%" cy="28%" r="66%">
            <stop offset="0%"   stopColor="#FEF9EE" />
            <stop offset="22%"  stopColor={lite}    />
            <stop offset="60%"  stopColor={mid}     />
            <stop offset="100%" stopColor={dark}    />
          </radialGradient>

          <radialGradient id={`pg-${uid}`} cx="45%" cy="38%" r="60%">
            <stop offset="0%"   stopColor={lite} stopOpacity="0.96" />
            <stop offset="38%"  stopColor={mid}  stopOpacity="0.92" />
            <stop offset="78%"  stopColor={dark} stopOpacity="0.82" />
            <stop offset="100%" stopColor={dark} stopOpacity="0.52" />
          </radialGradient>

          <radialGradient id={`fg-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FEF3C7" stopOpacity="0.95" />
            <stop offset="60%"  stopColor={lite}    stopOpacity="0.5"  />
            <stop offset="100%" stopColor={mid}     stopOpacity="0"    />
          </radialGradient>

          <linearGradient id={`shim-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0"    />
            <stop offset="50%"  stopColor="white" stopOpacity="0.62" />
            <stop offset="100%" stopColor="white" stopOpacity="0"    />
          </linearGradient>

          {/* ── Clip paths ─────────────────────────────────────────────── */}
          <clipPath id={`sc-${uid}`}>
            <ellipse cx={CX} cy={CY} rx="40" ry="11" />
          </clipPath>

          {/* ── Gooey A — stream + neck + blob merging ─────────────────── */}
          <filter id={`gA-${uid}`} x="-90%" y="-15%" width="280%" height="145%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="b" />
            <feColorMatrix in="b" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="g"
            />
            <feBlend in="SourceGraphic" in2="g" />
          </filter>

          {/* ── Gooey B — puddle + lobes organic merging ───────────────── */}
          <filter id={`gB-${uid}`} x="-65%" y="-65%" width="230%" height="230%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
            <feColorMatrix in="b" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12"
              result="g"
            />
            <feBlend in="SourceGraphic" in2="g" />
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════════════════════
            LAYER 1 — Stream + Neck + Blob (gooey-merged via filter gA)
        ══════════════════════════════════════════════════════════════ */}
        <g filter={`url(#gA-${uid})`}>

          {/* Wobbly organic stream — curved path, not a rectangle */}
          <motion.path
            d={`
              M 77.5 0
              C 75.5 16 73.5 38 75 60
              C 75.8 72 76.5 82 78.5 93
              L 81.5 93
              C 83.5 82 84.2 72 85 60
              C 86.5 38 84.5 16 82.5 0
              Z
            `}
            fill={`url(#sg-${uid})`}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={streamCtrl}
            style={{ originX: '80px', originY: '0px' }}
          />

          {/* Neck — the pinch point just before blob */}
          <motion.ellipse
            cx="80" cy="93" rx="6.5" ry="4.5"
            fill={mid}
            initial={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            animate={neckCtrl}
            style={{ originX: '80px', originY: '93px' }}
          />

          {/* Teardrop Blob — grows and falls */}
          <motion.g
            initial={{ scaleX: 0.05, scaleY: 0.05, y: -28, opacity: 0 }}
            animate={blobCtrl}
            style={{ originX: '80px', originY: '106px' }}
          >
            {/* Main body — elongated teardrop (taller than wide) */}
            <ellipse cx="80" cy="106" rx="12.5" ry="16" fill={`url(#blg-${uid})`} />

            {/* Teardrop pointed tip at top */}
            <path
              d="M 76 91 Q 80 85 84 91"
              fill={mid}
            />

            {/* Primary specular highlight (off-center, upper-left) */}
            <ellipse cx="75" cy="97" rx="5" ry="6.5"
              fill="white" opacity="0.28" />

            {/* Sharp bright pinpoint */}
            <ellipse cx="73.5" cy="95" rx="2" ry="2.8"
              fill="white" opacity="0.52" />

            {/* Bottom shadow — adds depth */}
            <ellipse cx="81" cy="117" rx="7" ry="4"
              fill={dark} opacity="0.28" />

            {/* Mid-body rim light (right edge) */}
            <path d="M 91 100 Q 93 107 91 114"
              stroke="white" strokeWidth="1.5" strokeOpacity="0.18"
              strokeLinecap="round" fill="none" />
          </motion.g>
        </g>

        {/* ══════════════════════════════════════════════════════════════
            LAYER 2 — Impact burst flash
        ══════════════════════════════════════════════════════════════ */}
        <motion.ellipse
          cx={CX} cy={CY}
          rx="34" ry="11"
          fill={`url(#fg-${uid})`}
          initial={{ scale: 0, opacity: 0 }}
          animate={flashCtrl}
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
        />

        {/* ══════════════════════════════════════════════════════════════
            LAYER 3 — Satellite micro-droplets
        ══════════════════════════════════════════════════════════════ */}
        {SATS.map((s, i) => (
          <motion.ellipse
            key={i}
            cx={CX} cy={CY}
            rx={s.rx} ry={s.ry}
            fill={
              i % 3 === 0 ? lite
              : i % 3 === 1 ? mid
              : dark
            }
            opacity={0}
            initial={{ x: 0, y: 0, scaleX: 0.05, scaleY: 0.05, opacity: 0 }}
            animate={satCtrls[i]}
            style={{ originX: `${CX}px`, originY: `${CY}px` }}
          />
        ))}

        {/* ══════════════════════════════════════════════════════════════
            LAYER 4 — Organic puddle (multi-lobe merged by gooey filter gB)
        ══════════════════════════════════════════════════════════════ */}
        <g filter={`url(#gB-${uid})`}>
          {/* Core puddle */}
          <motion.ellipse
            cx={CX} cy={CY}
            rx="30" ry="10.5"
            fill={`url(#pg-${uid})`}
            initial={{ scaleX: 0.06, scaleY: 0.06, opacity: 0 }}
            animate={puddleCtrl}
            style={{ originX: `${CX}px`, originY: `${CY}px` }}
          />

          {/* Right lobe — merges organically via gooey filter */}
          <motion.ellipse
            cx={CX + 25} cy={CY - 1}
            rx="16" ry="7.5"
            fill={mid}
            initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
            animate={lobe1Ctrl}
            style={{ originX: `${CX + 25}px`, originY: `${CY - 1}px` }}
          />

          {/* Left lobe */}
          <motion.ellipse
            cx={CX - 24} cy={CY + 1.5}
            rx="17" ry="7.5"
            fill={mid}
            initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
            animate={lobe2Ctrl}
            style={{ originX: `${CX - 24}px`, originY: `${CY + 1.5}px` }}
          />

          {/* Front-right micro-lobe */}
          <motion.ellipse
            cx={CX + 13} cy={CY + 7}
            rx="13" ry="6"
            fill={`url(#pg-${uid})`}
            initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
            animate={lobe3Ctrl}
            style={{ originX: `${CX + 13}px`, originY: `${CY + 7}px` }}
          />

          {/* Back-left micro-lobe */}
          <motion.ellipse
            cx={CX - 14} cy={CY - 5}
            rx="12" ry="5.5"
            fill={`url(#pg-${uid})`}
            initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
            animate={lobe4Ctrl}
            style={{ originX: `${CX - 14}px`, originY: `${CY - 5}px` }}
          />
        </g>

        {/* ══════════════════════════════════════════════════════════════
            LAYER 5 — Puddle surface details (above gooey, not merged)
        ══════════════════════════════════════════════════════════════ */}
        {/* Broad surface highlight — 3D depth illusion */}
        <motion.ellipse
          cx={CX - 5} cy={CY - 3.5}
          rx="16" ry="4.5"
          fill="white"
          initial={{ opacity: 0 }}
          animate={hlCtrl}
          style={{ originX: `${CX - 5}px`, originY: `${CY - 3.5}px` }}
        />

        {/* Rim specular — bright edge at front */}
        <motion.path
          d={`M ${CX - 26} ${CY + 2} Q ${CX} ${CY + 13} ${CX + 26} ${CY + 2}`}
          stroke={lite}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0"
          animate={hlCtrl}
        />

        {/* ══════════════════════════════════════════════════════════════
            LAYER 6 — Ripple rings
        ══════════════════════════════════════════════════════════════ */}
        <motion.ellipse
          cx={CX} cy={CY} rx="26" ry="8.5"
          stroke={lite} strokeWidth="3" fill="none" strokeLinecap="round"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={ring1Ctrl}
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
        />
        <motion.ellipse
          cx={CX} cy={CY} rx="26" ry="8.5"
          stroke={mid} strokeWidth="2.2" fill="none" strokeLinecap="round"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={ring2Ctrl}
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
        />
        <motion.ellipse
          cx={CX} cy={CY} rx="26" ry="8.5"
          stroke={dark} strokeWidth="1.4" fill="none" strokeLinecap="round"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={ring3Ctrl}
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
        />

        {/* ══════════════════════════════════════════════════════════════
            LAYER 7 — Shimmer sweep (light beam across puddle surface)
        ══════════════════════════════════════════════════════════════ */}
        <motion.g
          clipPath={`url(#sc-${uid})`}
          initial={{ x: -55 }}
          animate={shimCtrl}
        >
          <rect
            x={CX - 60} y={CY - 14}
            width="28" height="28"
            fill={`url(#shim-${uid})`}
          />
        </motion.g>
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main SqizzyBottle Component
// ─────────────────────────────────────────────────────────────────────────────
export const SqizzyBottle = ({
  flavor      = 'Original Roasted',
  accentColor = '#D97706',
  tagline     = 'The Everyday Golden Squeeze',
  badge       = '100% Peanuts',
  className   = '',
  interactive = true,
  size        = 'lg', // sm | md | lg | hero
}) => {
  const [isSqueezed, setIsSqueezed] = useState(false);
  const [showDrip,   setShowDrip]   = useState(false);
  const [drizzleKey, setDrizzleKey] = useState(0);

  const sizeStyles = {
    sm:   'w-36 h-64',
    md:   'w-48 h-80',
    lg:   'w-64 h-[26rem]',
    hero: 'w-72 sm:w-80 md:w-96 h-[30rem] md:h-[34rem]',
  };

  const handleSqueeze = () => {
    if (!interactive || isSqueezed) return;
    setIsSqueezed(true);
    setShowDrip(true);
    setDrizzleKey(k => k + 1);
    setTimeout(() => setIsSqueezed(false), 900);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Tap Hint */}
      {interactive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
          className="absolute -top-7 px-3 py-1 bg-[#29150B] text-[#FFFBEB] text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer z-20 border border-[#F59E0B]/30"
          onClick={handleSqueeze}
        >
          <Sparkles className="w-3 h-3 text-[#F59E0B] animate-spin" />
          <span>Tap to Squeeze</span>
        </motion.div>
      )}

      {/* ── Bottle container with squeeze spring ────────────────────────── */}
      <motion.div
        animate={
          isSqueezed
            ? { scaleX: 0.88, scaleY: 1.05 }
            : { scaleX: 1,    scaleY: 1     }
        }
        transition={isSqueezed ? SQUEEZE_SPRING : RELEASE_SPRING}
        onHoverStart={() => interactive && !isSqueezed && handleSqueeze()}
        onClick={handleSqueeze}
        className={`relative ${sizeStyles[size] || sizeStyles.lg} cursor-pointer group flex flex-col items-center justify-center drop-shadow-2xl`}
        style={{ originY: 0.5 }}
      >
        {/* Ambient Glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
          animate={{ opacity: isSqueezed ? 0.58 : 0.28 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ backgroundColor: accentColor }}
        />

        {/* ── 3D SVG Bottle ──────────────────────────────────────────────── */}
        <svg
          viewBox="0 0 260 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_25px_35px_rgba(41,21,11,0.25)]"
        >
          <defs>
            <linearGradient id="bottleShine" x1="0" y1="0" x2="260" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#FFFBEB" stopOpacity="0.4"  />
              <stop offset="25%"  stopColor="#FFFFFF" stopOpacity="0.9"  />
              <stop offset="50%"  stopColor="#FEF3C7" stopOpacity="0.5"  />
              <stop offset="85%"  stopColor="#D97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#29150B" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="pbGradient" x1="0" y1="0" x2="260" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#F59E0B"    />
              <stop offset="45%"  stopColor={accentColor} />
              <stop offset="100%" stopColor="#78350F"    />
            </linearGradient>
            <linearGradient id="capGradient" x1="60" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#3D1C06" />
              <stop offset="40%"  stopColor="#5B290B" />
              <stop offset="100%" stopColor="#1B0C04" />
            </linearGradient>
            <filter id="labelShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Dispenser Cap */}
          <rect x="75" y="420" width="110" height="35" rx="10"
            fill="url(#capGradient)" stroke="#190B05" strokeWidth="2" />
          <line x1="90"  y1="425" x2="90"  y2="450" stroke="#78350F" strokeWidth="2" />
          <line x1="105" y1="425" x2="105" y2="450" stroke="#78350F" strokeWidth="2" />
          <line x1="120" y1="425" x2="120" y2="450" stroke="#78350F" strokeWidth="2" />
          <line x1="135" y1="425" x2="135" y2="450" stroke="#78350F" strokeWidth="2" />
          <line x1="150" y1="425" x2="150" y2="450" stroke="#78350F" strokeWidth="2" />
          <line x1="165" y1="425" x2="165" y2="450" stroke="#78350F" strokeWidth="2" />

          {/* Anti-Drip Nozzle */}
          <ellipse cx="130" cy="455" rx="20" ry="6"
            fill="#EA580C" stroke="#29150B" strokeWidth="1.5" />
          <circle cx="130" cy="455" r="3" fill="#29150B" />

          {/* Bottle Body */}
          <path
            d="M 65,40 C 50,70 35,140 38,220 C 40,280 50,340 55,390 C 58,415 80,422 130,422 C 180,422 202,415 205,390 C 210,340 220,280 222,220 C 225,140 210,70 195,40 C 180,15 155,10 130,10 C 105,10 80,15 65,40 Z"
            fill="url(#pbGradient)"
          />
          {/* Frosted Shell */}
          <path
            d="M 65,40 C 50,70 35,140 38,220 C 40,280 50,340 55,390 C 58,415 80,422 130,422 C 180,422 202,415 205,390 C 210,340 220,280 222,220 C 225,140 210,70 195,40 C 180,15 155,10 130,10 C 105,10 80,15 65,40 Z"
            fill="url(#bottleShine)"
            stroke="#FEF3C7" strokeWidth="3" strokeOpacity="0.6"
          />

          {/* Grip Grooves */}
          <path d="M 45 180 Q 52 210 46 240" stroke="#78350F" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4" />
          <path d="M 47 160 Q 54 185 48 210" stroke="#FFFBEB" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
          <path d="M 215 180 Q 208 210 214 240" stroke="#78350F" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4" />
          <path d="M 213 160 Q 206 185 212 210" stroke="#FFFBEB" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />

          {/* Brand Label */}
          <g filter="url(#labelShadow)">
            <rect x="44" y="100" width="172" height="240" rx="20"
              fill="#29150B" stroke="#F59E0B" strokeWidth="2" />
            <path d="M 44 100 L 216 100 L 216 135 L 44 145 Z" fill={accentColor} opacity="0.9" />
            <circle cx="130" cy="140" r="22" fill="#FFFBEB" stroke="#D97706" strokeWidth="2.5" />
            <path d="M 130 126 C 124 134 120 138 120 142 C 120 146 124 150 130 150 C 136 150 140 146 140 142 C 140 138 136 134 130 126 Z" fill="#D97706" />
            <text x="130" y="190" textAnchor="middle" fill="#FFFBEB"
              fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="28" letterSpacing="1">
              SQIZZY
            </text>
            <text x="130" y="212" textAnchor="middle" fill="#F59E0B"
              fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="11" letterSpacing="2">
              {flavor.toUpperCase()}
            </text>
            <line x1="75" y1="228" x2="185" y2="228" stroke="#785A48" strokeWidth="1" strokeDasharray="3 3" />
            <rect x="65" y="240" width="130" height="22" rx="6" fill="#3D1F10" stroke="#D97706" strokeWidth="1" />
            <text x="130" y="255" textAnchor="middle" fill="#FEF3C7"
              fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="10">
              SHAKE • SQUEEZE • DRIZZLE
            </text>
            <rect x="75" y="270" width="110" height="18" rx="4" fill="#F59E0B" />
            <text x="130" y="283" textAnchor="middle" fill="#29150B"
              fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="9">
              {badge.toUpperCase()}
            </text>
            <text x="130" y="315" textAnchor="middle" fill="#A88B77"
              fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="500" fontSize="9">
              NET WT. 375g (13.2 OZ)
            </text>
          </g>

          {/* Gloss Reflection */}
          <path
            d="M 60 70 C 50 120 48 180 50 250 C 52 300 58 350 62 380"
            stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.4"
          />
        </svg>

        {/* ── Realistic PB Drip (mounts fresh each squeeze) ──────────────── */}
        <AnimatePresence>
          {showDrip && (
            <PeanutButterDrip
              key={drizzleKey}
              accent={accentColor}
              size={size}
              onDone={() => setShowDrip(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
