import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  ArrowLeft, 
  Users, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  Globe, 
  Zap, 
  Database, 
  Clock, 
  Filter, 
  Layers, 
  Compass, 
  CheckCircle2, 
  Activity,
  HeartHandshake
} from 'lucide-react';
import { SqizzyLogo } from '../../components/common/SqizzyLogo';
import { SEO } from '../../components/common/SEO';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const AdminMethodologyPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!authLoading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const kpis = [
    {
      title: 'Unique Visitors',
      event: 'Client UUID Initialization',
      formula: 'Count of Distinct visitorId active within Date Window',
      detail: 'Generated on client using RFC4122 crypto.randomUUID() and stored in localStorage under "sqizzy_visitor_id". Persists across multiple visits without cookies or invasive tracking.',
      badge: 'Identity Layer'
    },
    {
      title: 'Total Sessions',
      event: 'Session Timeout Watcher',
      formula: 'Count of Distinct sessionId with 30-min Inactivity Window',
      detail: 'Generated in sessionStorage ("sqizzy_session_id"). If user is inactive for >30 minutes, a fresh session token is minted on the next interaction.',
      badge: 'Session Layer'
    },
    {
      title: 'Page Views',
      event: 'page_view',
      formula: 'Σ (All page_view events across / , /products, /story, etc.)',
      detail: 'Triggered whenever React Router completes a page navigation (with debounce guards to prevent duplicate renders from re-firing).',
      badge: 'Navigation'
    },
    {
      title: 'Product Views',
      event: 'product_view',
      formula: 'Σ (product_view events on /products/:slug and preview modals)',
      detail: 'Recorded with product payload metadata (e.g. flavor: "Original Smooth", slug: "sqizzy-original-smooth") to measure individual flavor interest.',
      badge: 'Product Intent'
    },
    {
      title: 'Buy / Pre-Order CTA Clicks',
      event: 'product_cta_click & hero_cta_click',
      formula: 'Σ (product_cta_click + hero_cta_click events)',
      detail: 'Captured every time a user clicks "GET SQIZZY", "COMING SOON", or "JOIN VIP WAITLIST FOR FIRST BATCH" across Hero, Cards, and PDP.',
      badge: 'Intent Metric'
    },
    {
      title: 'Waitlist Joined',
      event: 'waitlist_submit & MongoDB Record',
      formula: 'Count of Distinct Verified Email Documents in MongoDB',
      detail: 'Strictly stored in the database "Waitlist" collection. Deduplicated by lowercase email with timestamp, name, phone, and flavor interest.',
      badge: 'Conversion'
    },
    {
      title: 'Feedback Given',
      event: 'feedback_submit & MongoDB Record',
      formula: 'Count of Verified 1–5 Star Rating Records in MongoDB',
      detail: 'Captures star rating (1–5), detailed text suggestions, age group, and favorite flavor directly in the database "Feedback" collection.',
      badge: 'Feedback'
    },
    {
      title: 'Pre-Launch Conversion Rate',
      event: 'Mathematical Ratio',
      formula: '(Total Waitlist Joined ÷ Total Unique Visitors) × 100',
      detail: 'Measures what percentage of total unique visitors expressed strong purchase intent by completing the VIP launch waitlist form.',
      badge: 'KPI Ratio'
    },
    {
      title: 'Clicks / Unique Visitor',
      event: 'Engagement Ratio',
      formula: 'Total Buy CTA Clicks ÷ Total Unique Visitors',
      detail: 'Indicates high product curiosity: an average >1.0 indicates visitors are exploring multiple flavor cards and repeat-clicking purchase intent CTAs.',
      badge: 'Ratio'
    },
    {
      title: 'Avg Session Duration',
      event: 'Heartbeat Tracking',
      formula: 'Σ (Session lastActive - Session startTime) ÷ Total Sessions',
      detail: 'Tracked between session initialization and the last user interaction (clicks, scrolls, navigation) within the 30-minute active window.',
      badge: 'Time Metric'
    },
    {
      title: 'Engagement Rate',
      event: 'Behavioral Metric',
      formula: '(Sessions with >1 Page View OR ≥1 CTA Click) ÷ Total Sessions × 100',
      detail: 'Evaluates non-bounce interactive sessions where visitors explored beyond landing or interacted with squeeze bottles/CTAs.',
      badge: 'Quality Metric'
    }
  ];

  const deepDives = [
    {
      title: 'Detailed Traffic Timeline',
      icon: <Activity className="w-5 h-5 text-[#F59E0B]" />,
      desc: 'How traffic spikes, views, and intent correlate over time.',
      points: [
        'Aggregates events into hourly bins (for 24h/today) or daily bins (7D, 30D, 90D).',
        'Plots Page Views (top of funnel), CTA Clicks (intent), and Waitlist Submissions (conversions) on an overlay time-series chart.',
        'Identifies launch drop spikes, social media influencer mentions, and high-converting marketing windows.'
      ]
    },
    {
      title: 'Pre-Launch Conversion Funnel',
      icon: <Layers className="w-5 h-5 text-[#D97706]" />,
      desc: '4-Stage visitor progression and drop-off analysis.',
      points: [
        'Stage 1: All Page Views (Total traffic landing on the SQIZZY platform).',
        'Stage 2: Product Views (Visitors who browsed flavor profiles or clicked product details).',
        'Stage 3: Buy CTA Clicks (Visitors clicking pre-order or coming soon CTAs).',
        'Stage 4: Waitlist Conversions (Completed and verified VIP email submissions).',
        'Step-by-step retention rates are computed between each successive stage to identify optimization opportunities.'
      ]
    },
    {
      title: 'Product Interest & Click-Through Rate (CTR)',
      icon: <TrendingUp className="w-5 h-5 text-[#EA580C]" />,
      desc: 'Flavor-by-flavor popularity and intent distribution.',
      points: [
        'Tracks individual product views and CTA interactions per flavor slug (Original Smooth, Signature Crunch, Dark Cocoa Hazelnut, High Protein).',
        'Calculates Flavor CTR = (Flavor CTA Clicks ÷ Flavor Product Views) × 100.',
        'Informs initial factory production batch ratios based on real consumer pre-order demand.'
      ]
    },
    {
      title: 'Traffic Sources & UTM Campaigns',
      icon: <Compass className="w-5 h-5 text-[#10B981]" />,
      desc: 'Attribution tracking: from where and which campaigns users arrive.',
      points: [
        'UTM Query Parser: Automatically reads utm_source, utm_medium, utm_campaign, utm_term, and utm_content from the URL.',
        'Referrer Fallback: Categorizes traffic into Organic Search (Google, Bing), Social (Instagram, TikTok, YouTube, Reddit), Referral, or Direct.',
        'Persists initial marketing source across the visitor’s lifetime sessions.'
      ]
    },
    {
      title: 'Devices, Browsers & OS Breakdown',
      icon: <Smartphone className="w-5 h-5 text-[#6366F1]" />,
      desc: 'Hardware and browser technology distribution.',
      points: [
        'Device Type: Classifies userAgent into Mobile, Tablet, or Desktop.',
        'Browser Engine: Identifies Chrome, Safari, Firefox, Edge, or in-app browsers (Instagram / TikTok WebViews).',
        'Operating System: Detects iOS, Android, macOS, Windows, Linux.',
        'Screen Dimensions: Evaluates viewport sizes (e.g. 390x844, 1920x1080) for mobile UX tuning.'
      ]
    },
    {
      title: 'Geographic Analytics',
      icon: <Globe className="w-5 h-5 text-[#EC4899]" />,
      desc: 'City and regional demand mapping for regional launch planning.',
      points: [
        'Direct City Submissions: Captured when VIP waitlist members provide their delivery city.',
        'Regional IP Geo-Inference: High-level country and metro region categorization.',
        'Helps optimize retail distribution and logistics partner selection.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F0602] text-[#FFFBEB] flex flex-col selection:bg-[#D97706] selection:text-[#29150B]">
      <SEO 
        title="SQIZZY Admin — Analytics Methodology & Calculations Guide" 
        description="Comprehensive reference on SQIZZY first-party telemetry, KPI math formulas, and analytics pipeline." 
      />

      {/* Top Header Bar */}
      <header className="bg-[#190B05] border-b border-[#2E1508] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SqizzyLogo size="sm" isDark={true} />
          <span className="px-2.5 py-0.5 rounded-full bg-[#D97706]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-[11px] font-mono font-bold uppercase">
            Formula & Tracking Guide
          </span>
        </div>

        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E1508] border border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#3D1C0E] text-xs font-bold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1E0D06] via-[#2A1308] to-[#1E0D06] border border-[#3D1C0E] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D97706]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold">
              <Calculator className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Full Technical & Mathematical Specification</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#FFFBEB] tracking-tight">
              HOW SQIZZY CALCULATES ANALYTICS & KPIS
            </h1>
            <p className="text-[#A88B77] text-sm sm:text-base leading-relaxed">
              SQIZZY operates a privacy-first, zero-third-party telemetry pipeline. Events are emitted directly by user interactions, processed via non-blocking beacons, and persisted to MongoDB for accurate pre-launch market validation.
            </p>
          </div>
        </div>

        {/* 1. Core KPIs Table & Formula Breakdown */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-[#FFFBEB] flex items-center gap-2.5">
                <Database className="w-6 h-6 text-[#D97706]" />
                <span>Primary KPI Formulas & Event Definitions</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#A88B77] mt-1">
                Exact mathematical algorithms and event trigger points for every top-level metric.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpis.map((kpi, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#140803] border border-[#2E1508] hover:border-[#F59E0B]/40 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-base text-[#FFFBEB]">{kpi.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2E1508] text-[#F59E0B] text-[10px] font-mono font-bold">
                      {kpi.badge}
                    </span>
                  </div>

                  {/* Formula Box */}
                  <div className="p-2.5 rounded-xl bg-[#1E0D06] border border-[#3D1C0E] font-mono text-xs text-[#F59E0B] flex items-center gap-2">
                    <span className="text-[#A88B77] font-bold">Formula:</span>
                    <span className="font-semibold">{kpi.formula}</span>
                  </div>

                  <p className="text-xs text-[#A88B77] leading-relaxed">
                    {kpi.detail}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#2E1508] flex items-center justify-between text-[11px] text-[#785A48]">
                  <span>Telemetry Event:</span>
                  <span className="font-mono text-[#D97706] font-bold">{kpi.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Deep-Dive Analytics Modules */}
        <div className="space-y-6 pt-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-[#FFFBEB] flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-[#F59E0B]" />
              <span>Deep-Dive Tracking Modules & Data Logic</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A88B77] mt-1">
              How timelines, conversion funnels, product ratings, traffic sources, and geo points are derived.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deepDives.map((mod, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#140803] border border-[#2E1508] hover:border-[#D97706]/40 transition-all space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1E0D06] border border-[#3D1C0E]">
                    {mod.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#FFFBEB]">{mod.title}</h3>
                    <p className="text-[11px] text-[#A88B77]">{mod.desc}</p>
                  </div>
                </div>

                <ul className="space-y-2 pt-2 border-t border-[#2E1508]">
                  {mod.points.map((pt, pIdx) => (
                    <li key={pIdx} className="text-xs text-[#A88B77] leading-relaxed flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Telemetry Architecture & Data Privacy Guarantee */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#140803] border border-[#2E1508] space-y-4">
          <div className="flex items-center gap-2.5 text-[#10B981]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-[#FFFBEB]">
              Privacy-Conscious First-Party Architecture
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#A88B77]">
            <div className="p-4 rounded-xl bg-[#1E0D06] border border-[#3D1C0E] space-y-1">
              <div className="font-bold text-[#FFFBEB]">Non-Blocking Dispatch</div>
              <p>Events use <code className="text-[#F59E0B]">navigator.sendBeacon</code> and fetch <code className="text-[#F59E0B]">keepalive</code>. Tracking never delays UI clicks or page navigation.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#1E0D06] border border-[#3D1C0E] space-y-1">
              <div className="font-bold text-[#FFFBEB]">Zero Third-Party Trackers</div>
              <p>No Google Tag Manager, Meta Pixel, or external cookies. All telemetry is 100% first-party and stored exclusively in your MongoDB database.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#1E0D06] border border-[#3D1C0E] space-y-1">
              <div className="font-bold text-[#FFFBEB]">Strict Data Persistence</div>
              <p>Waitlist emails, contact messages, and feedback are validated with Zod schemas and persisted in MongoDB with automatic index optimization.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminMethodologyPage;
