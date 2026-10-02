import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { SqizzyLogo } from '../common/SqizzyLogo';
import { trackHeroCtaClick } from '../../analytics/tracker';

export const Navbar = ({ onOpenWaitlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Shop', path: '/products' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Feedback', path: '/feedback' },
  ];

  const handleCtaClick = () => {
    trackHeroCtaClick('Get Sqizzy', 'navbar');
    if (onOpenWaitlist) onOpenWaitlist();
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#FDF8F0]/90 backdrop-blur-md shadow-sm border-b border-[#E8DCCF]/80 py-3' 
        : 'bg-[#FDF8F0] py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <SqizzyLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors relative py-1 ${
                    isActive 
                      ? 'text-[#D97706]' 
                      : 'text-[#29150B]/80 hover:text-[#D97706]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleCtaClick}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <span>GET SQIZZY</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleCtaClick}
              className="py-1.5 px-3 rounded-lg bg-[#D97706] text-[#FFFBEB] font-bold text-xs uppercase"
            >
              VIP
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#29150B] hover:bg-[#FEF3C7] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-[#FFFBEB] border-b border-[#E8DCCF] shadow-2xl p-6 transition-all">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-[#29150B] hover:text-[#D97706] py-2 border-b border-[#FEF3C7] flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 text-[#D97706]" />
              </Link>
            ))}

            <div className="pt-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleCtaClick();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#29150B]" />
                <span>JOIN THE VIP WAITLIST</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
