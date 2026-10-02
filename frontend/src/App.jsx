import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { Navbar } from './components/layout/Navbar';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Footer } from './components/layout/Footer';
import { WaitlistModal } from './components/common/WaitlistModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { OurStoryPage } from './pages/OurStoryPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { WaitlistPage } from './pages/WaitlistPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminMethodologyPage } from './pages/admin/AdminMethodologyPage';

import { trackPageView, initScrollTracker } from './analytics/tracker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes client cache
      refetchOnWindowFocus: false,
    },
  },
});

// Route change tracker & scroll reset
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    initScrollTracker();
  }, []);

  return null;
}

export function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistFlavor, setWaitlistFlavor] = useState('All Flavors');

  const handleOpenWaitlist = (flavor = 'All Flavors') => {
    setWaitlistFlavor(flavor);
    setWaitlistOpen(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <div className="min-h-screen flex flex-col selection:bg-[#D97706] selection:text-white">
          <RouteTracker />

          {/* Public Header Ribbon & Navigation */}
          {!isAdminRoute && (
            <>
              <AnnouncementBar onWaitlistClick={() => handleOpenWaitlist('All Flavors')} />
              <Navbar onOpenWaitlist={() => handleOpenWaitlist('All Flavors')} />
            </>
          )}

          {/* Main Route Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage onOpenWaitlist={handleOpenWaitlist} />} />
              <Route path="/products" element={<ProductsPage onOpenWaitlist={handleOpenWaitlist} />} />
              <Route path="/products/:slug" element={<ProductDetailPage onOpenWaitlist={handleOpenWaitlist} />} />
              <Route path="/about" element={<AboutPage onOpenWaitlist={handleOpenWaitlist} />} />
              <Route path="/our-story" element={<OurStoryPage onOpenWaitlist={handleOpenWaitlist} />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/coming-soon" element={<ComingSoonPage onOpenWaitlist={handleOpenWaitlist} />} />
              
              {/* Protected / Admin Routes */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/methodology" element={<AdminMethodologyPage />} />
              <Route path="/admin/calculations" element={<AdminMethodologyPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Public Footer */}
          {!isAdminRoute && (
            <Footer onOpenWaitlist={() => handleOpenWaitlist('All Flavors')} />
          )}

          {/* Global VIP Waitlist Modal */}
          <WaitlistModal
            isOpen={waitlistOpen}
            onClose={() => setWaitlistOpen(false)}
            defaultFlavor={waitlistFlavor}
          />
        </div>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
