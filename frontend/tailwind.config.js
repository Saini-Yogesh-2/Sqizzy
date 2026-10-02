/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sqizzy: {
          peanut: '#D97706',      // Golden roasted peanut
          peanutLight: '#F59E0B', // Rich creamy honey peanut
          peanutDark: '#B45309',  // Deep slow-roasted amber
          chocolate: '#29150B',   // Deep dark cocoa plum
          chocolateDark: '#190B05',// Rich espresso black
          cream: '#FFFBEB',       // Soft organic milk cream
          sand: '#FEF3C7',        // Warm beige canvas
          zest: '#F97316',        // Vibrant citrus pop accent
          zestDark: '#EA580C',    // Deep tangerine
          surface: '#FFFFFF',
          surfaceDark: '#1F120C',
          muted: '#785A48',
          border: '#E8DCCF',
          borderDark: '#3D2517'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'sqizzy': '0 10px 30px -5px rgba(41, 21, 11, 0.08), 0 4px 12px -2px rgba(41, 21, 11, 0.04)',
        'sqizzy-lg': '0 20px 40px -10px rgba(41, 21, 11, 0.14), 0 8px 16px -4px rgba(41, 21, 11, 0.06)',
        'sqizzy-glow': '0 0 35px -5px rgba(217, 119, 6, 0.35)',
        'sqizzy-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      keyframes: {
        drizzle: {
          '0%': { transform: 'translateY(-10px) scaleY(0.9)', opacity: '0.8' },
          '50%': { transform: 'translateY(10px) scaleY(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(-10px) scaleY(0.9)', opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        }
      },
      animation: {
        drizzle: 'drizzle 4s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
