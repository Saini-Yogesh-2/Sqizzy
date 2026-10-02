import React from 'react';
import { SEO } from '../components/common/SEO';

export const PrivacyPolicyPage = () => {
  return (
    <div className="py-12 md:py-20 bg-[#FDF8F0] min-h-screen">
      <SEO 
        title="Privacy Policy — SQIZZY" 
        description="Learn how SQIZZY handles data, first-party analytics, cookies, local storage, and privacy rights."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-[#E8DCCF] pb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D97706] font-bold">
            Transparency & Security
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#29150B] mt-2">
            PRIVACY POLICY
          </h1>
          <p className="mt-2 text-xs font-mono text-[#785A48]">
            Effective Date: October 2026 • Version 1.0 (Pre-Launch)
          </p>
        </div>

        <div className="bg-[#FFFBEB] rounded-3xl p-6 sm:p-10 border border-[#E8DCCF] space-y-8 text-sm text-[#29150B] leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">1. Overview & Commitment</h2>
            <p className="text-[#785A48]">
              At SQIZZY ("we", "our", or "us"), we value and respect your privacy. This Privacy Policy details how we collect, store, and process information when you visit our website (sqizzy.co) during our pre-launch stage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">2. Information We Collect</h2>
            <div className="space-y-2 text-[#785A48]">
              <p><strong>A. First-Party Anonymous Analytics:</strong> We collect non-personally identifiable telemetry to measure interest in our squeeze peanut butter products. This includes:</p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Anonymous Visitor ID (a randomly generated UUID stored in your browser's local storage).</li>
                <li>Session ID (a temporary identifier refreshed after 30 minutes of inactivity).</li>
                <li>Interaction telemetry (page views, scroll depth milestones, button clicks, FAQ interactions).</li>
                <li>Technical metadata (approximate browser family, operating system, general device category, and screen resolution).</li>
                <li>Referral URLs and campaign parameters (UTM tags).</li>
              </ul>
              <p className="pt-2"><strong>B. Voluntary User Submissions:</strong> When you voluntarily submit forms on our website, we collect:</p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>VIP Waitlist:</strong> Email address, optional name, optional city, and flavor preference.</li>
                <li><strong>Feedback:</strong> 1-5 star excitement rating, text feedback, optional name, optional email, and optional demographic choices.</li>
                <li><strong>Contact Inquiries:</strong> Name, email address, inquiry topic, and message content.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">3. Cookies & Local Storage</h2>
            <p className="text-[#785A48]">
              We use first-party browser local storage and session storage exclusively to maintain your anonymous session state across page navigation and prevent duplicate popups. We do NOT use invasive cross-site advertising tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">4. How We Use Information</h2>
            <ul className="list-disc list-inside pl-4 space-y-1 text-[#785A48]">
              <li>To evaluate consumer demand across different flavor profiles and regions.</li>
              <li>To notify waitlist subscribers when initial production batches are ready for launch.</li>
              <li>To improve website performance, usability, and accessibility.</li>
              <li>To respond directly to inquiries and consumer feedback.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">5. Data Retention & Security</h2>
            <p className="text-[#785A48]">
              Data is stored securely in encrypted databases. We retain analytics events for performance evaluation and aggregate reporting. Form submissions are retained solely for pre-launch outreach and customer support. We never sell, rent, or trade your personal information to third-party data brokers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#29150B] mb-2">6. Your Rights & Contact</h2>
            <p className="text-[#785A48]">
              You may request access to, correction of, or deletion of your email from our waitlist at any time by contacting our data protection officer at:
            </p>
            <p className="mt-2 font-mono text-xs text-[#D97706] font-bold">
              privacy@sqizzy.co
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
