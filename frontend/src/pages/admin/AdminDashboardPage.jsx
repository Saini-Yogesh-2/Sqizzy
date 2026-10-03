import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, Eye, MousePointerClick, Heart, MessageSquare, 
  TrendingUp, Globe, Smartphone, LogOut, RefreshCw, 
  Download, Calendar, Shield, Sparkles, Filter, ChevronRight,
  Laptop, Compass, CheckCircle2, Clock, Calculator,
  AlertCircle, Database
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  getAdminOverview, 
  getAdminTraffic, 
  getAdminFunnel, 
  getAdminProducts, 
  getAdminSources, 
  getAdminDevices, 
  getAdminGeo, 
  getAdminWaitlist, 
  getAdminFeedback 
} from '../../services/api';
import { SqizzyLogo } from '../../components/common/SqizzyLogo';
import { SEO } from '../../components/common/SEO';

const COLORS = ['#D97706', '#F59E0B', '#EA580C', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

// 5-Minute In-Memory Dashboard Cache (keyed by dateRange)
const dashboardCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const AdminDashboardPage = () => {
  const { isAuthenticated, isLoading: authLoading, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview'); // overview, traffic, funnel, products, sources, tech, feedback, waitlist
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Analytics State
  const [overview, setOverview] = useState(null);
  const [traffic, setTraffic] = useState([]);
  const [funnel, setFunnel] = useState([]);
  const [products, setProducts] = useState([]);
  const [sources, setSources] = useState({ sources: [], campaigns: [] });
  const [devices, setDevices] = useState({ devices: [], browsers: [], os: [] });
  const [geo, setGeo] = useState({ countries: [], cities: [] });
  const [waitlist, setWaitlist] = useState([]);
  const [feedback, setFeedback] = useState({ feedback: [], ratingDistribution: [], averageRating: 5 });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchDashboardData = async (forceRefresh = false) => {
    // Check 5-minute cache first if not explicitly forced
    if (!forceRefresh && dashboardCache.has(dateRange)) {
      const cached = dashboardCache.get(dateRange);
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        const { data } = cached;
        setOverview(data.overview);
        setTraffic(data.traffic);
        setFunnel(data.funnel);
        setProducts(data.products);
        setSources(data.sources);
        setDevices(data.devices);
        setGeo(data.geo);
        setWaitlist(data.waitlist);
        setFeedback(data.feedback);
        setLoading(false);
        setFetchError(null);
        return;
      }
    }

    setLoading(true);
    setFetchError(null);
    try {
      const [
        ovRes,
        tfRes,
        fnRes,
        pdRes,
        scRes,
        dvRes,
        geRes,
        wlRes,
        fbRes
      ] = await Promise.all([
        getAdminOverview(dateRange).catch((err) => ({ data: null, error: err })),
        getAdminTraffic(dateRange).catch(() => ({ data: [] })),
        getAdminFunnel(dateRange).catch(() => ({ data: [] })),
        getAdminProducts(dateRange).catch(() => ({ data: [] })),
        getAdminSources(dateRange).catch(() => ({ data: { sources: [], campaigns: [] } })),
        getAdminDevices(dateRange).catch(() => ({ data: { devices: [], browsers: [], os: [] } })),
        getAdminGeo(dateRange).catch(() => ({ data: { countries: [], cities: [] } })),
        getAdminWaitlist().catch(() => ({ data: [] })),
        getAdminFeedback().catch(() => ({ data: { feedback: [], ratingDistribution: [], averageRating: 5 } }))
      ]);

      if (!ovRes.data && ovRes.error) {
        throw ovRes.error;
      }

      const freshData = {
        overview: ovRes.data || {},
        traffic: tfRes.data || [],
        funnel: fnRes.data || [],
        products: pdRes.data || [],
        sources: scRes.data || { sources: [], campaigns: [] },
        devices: dvRes.data || { devices: [], browsers: [], os: [] },
        geo: geRes.data || { countries: [], cities: [] },
        waitlist: wlRes.data || [],
        feedback: fbRes.data || { feedback: [], ratingDistribution: [], averageRating: 5 }
      };

      // Store in 5-minute cache
      dashboardCache.set(dateRange, {
        timestamp: Date.now(),
        data: freshData
      });

      setOverview(freshData.overview);
      setTraffic(freshData.traffic);
      setFunnel(freshData.funnel);
      setProducts(freshData.products);
      setSources(freshData.sources);
      setDevices(freshData.devices);
      setGeo(freshData.geo);
      setWaitlist(freshData.waitlist);
      setFeedback(freshData.feedback);
    } catch (e) {
      console.error('Failed to load dashboard metrics:', e);
      setFetchError(e.message || 'Unable to connect to the analytics server. Please check your network or serverless function.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData(false);
    }
  }, [isAuthenticated, dateRange]);

  const handleLogout = async () => {
    dashboardCache.clear();
    await logout();
    navigate('/admin');
  };

  const handleExportWaitlist = () => {
    const token = localStorage.getItem('sqizzy_admin_token') || '';
    const baseUrl = import.meta.env.VITE_API_URL || '';
    window.open(`${baseUrl}/api/analytics/export/waitlist${token ? `?token=${encodeURIComponent(token)}` : ''}`, '_blank');
  };

  const handleExportFeedback = () => {
    const token = localStorage.getItem('sqizzy_admin_token') || '';
    const baseUrl = import.meta.env.VITE_API_URL || '';
    window.open(`${baseUrl}/api/analytics/export/feedback${token ? `?token=${encodeURIComponent(token)}` : ''}`, '_blank');
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#140803] flex items-center justify-center text-[#FFFBEB]">
        <div className="w-8 h-8 border-3 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0602] text-[#FFFBEB] flex flex-col">
      <SEO title="SQIZZY — Admin Analytics Dashboard" description="Owner analytics and interest insights." />

      {/* Top Header Bar */}
      <header className="bg-[#190B05] border-b border-[#2E1508] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SqizzyLogo size="sm" isDark={true} />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#D97706]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-[11px] font-mono font-bold uppercase">
            Live Analytics
          </span>
        </div>

        {/* Date Selector & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#140803] rounded-xl p-1 border border-[#2E1508] text-xs font-bold">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDateRange(d.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  dateRange === d.id
                    ? 'bg-[#D97706] text-[#29150B]'
                    : 'text-[#A88B77] hover:text-[#FFFBEB]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <Link
            to="/admin/methodology"
            title="View KPI calculation and telemetry formulas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E1508] border border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#3D1C0E] transition-all text-xs font-bold shadow-sm"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Calculations & Logic</span>
          </Link>

          <button
            onClick={() => fetchDashboardData(true)}
            title="Refresh metrics"
            className="p-2 rounded-xl bg-[#140803] border border-[#2E1508] text-[#A88B77] hover:text-[#FFFBEB] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 transition-colors flex items-center gap-1.5 text-xs font-bold px-3"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar Navigation */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-[#140803] border-r border-[#2E1508] p-4 flex md:flex-col gap-1.5 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview KPIs', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'traffic', label: 'Traffic & Views', icon: <Eye className="w-4 h-4" /> },
            { id: 'funnel', label: 'Conversion Funnel', icon: <Filter className="w-4 h-4" /> },
            { id: 'products', label: 'Product Analytics', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'sources', label: 'Traffic Sources / UTM', icon: <Compass className="w-4 h-4" /> },
            { id: 'tech', label: 'Devices & Browsers', icon: <Laptop className="w-4 h-4" /> },
            { id: 'geo', label: 'Geographic Insights', icon: <Globe className="w-4 h-4" /> },
            { id: 'feedback', label: 'Consumer Feedback', icon: <MessageSquare className="w-4 h-4" />, count: feedback.feedback?.length },
            { id: 'waitlist', label: 'Waitlist Subscribers', icon: <Heart className="w-4 h-4" />, count: waitlist?.length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-[#D97706] text-[#190B05] shadow-md'
                  : 'text-[#A88B77] hover:bg-[#1F0E06] hover:text-[#FFFBEB]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
                  activeTab === item.id ? 'bg-[#190B05] text-[#F59E0B]' : 'bg-[#2E1508] text-[#A88B77]'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Dashboard Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          {/* Background Refresh Indicator */}
          {loading && overview && (
            <div className="mb-6 p-3 rounded-2xl bg-[#D97706]/15 border border-[#F59E0B]/30 flex items-center justify-between text-xs text-[#F59E0B] font-bold shadow-sm animate-pulse">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing live analytics for {dateRange.toUpperCase()}...</span>
              </div>
              <span className="font-mono text-[10px] text-[#A88B77]">Connecting to MongoDB</span>
            </div>
          )}

          {/* Error Banner with Retry */}
          {fetchError && !loading && (
            <div className="p-6 rounded-3xl bg-red-950/40 border border-red-800/60 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-900/40 border border-red-700/50 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-200">Unable to synchronize analytics</h3>
                  <p className="text-xs text-red-300/80 mt-0.5">{fetchError}</p>
                </div>
              </div>
              <button
                onClick={() => fetchDashboardData(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] hover:brightness-110 text-xs font-black uppercase text-[#190B05] flex items-center gap-2 transition-all whitespace-nowrap shadow-lg active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          )}

          {/* Initial Loading Skeleton State */}
          {loading && !overview && (
            <div className="space-y-8 animate-pulse">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#190B05] via-[#241007] to-[#190B05] border border-[#D97706]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#D97706]/20 border border-[#F59E0B]/30 flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-[#F59E0B] animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-display font-black text-[#FFFBEB] flex items-center gap-2">
                      <span>Loading Live Analytics Dashboard</span>
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                    </h2>
                    <p className="text-xs text-[#A88B77] mt-0.5">
                      Querying MongoDB live telemetry & aggregating KPIs... Please wait a moment on cold start.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2E1508] border border-[#F59E0B]/20 text-xs font-mono text-[#F59E0B] font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </div>
              </div>

              {/* Skeleton KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#190B05] border border-[#2E1508] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-20 bg-[#2E1508] rounded" />
                      <div className="h-4 w-4 bg-[#2E1508] rounded-full" />
                    </div>
                    <div className="h-7 w-16 bg-[#2E1508] rounded" />
                  </div>
                ))}
              </div>

              {/* Skeleton Chart Box */}
              <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-4">
                <div className="h-4 w-48 bg-[#2E1508] rounded" />
                <div className="h-64 bg-[#140803] rounded-2xl border border-[#2E1508]/50 flex items-center justify-center text-xs text-[#785A48] font-mono">
                  Loading time-series charts...
                </div>
              </div>
            </div>
          )}
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && overview && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-display font-black text-[#FFFBEB]">
                  EXECUTIVE OVERVIEW
                </h1>
                <p className="text-xs text-[#A88B77] mt-0.5">
                  Real-time consumer interest metrics for pre-launch stage ({dateRange.toUpperCase()})
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Unique Visitors', value: overview.uniqueVisitors || 0, icon: <Users className="w-4 h-4 text-[#F59E0B]" /> },
                  { label: 'Total Sessions', value: overview.totalSessions || 0, icon: <Compass className="w-4 h-4 text-[#D97706]" /> },
                  { label: 'Page Views', value: overview.pageViews || 0, icon: <Eye className="w-4 h-4 text-[#F97316]" /> },
                  { label: 'Product Views', value: overview.productViews || 0, icon: <Sparkles className="w-4 h-4 text-[#10B981]" /> },
                  { label: 'Buy CTA Clicks', value: overview.buyClicks || 0, icon: <MousePointerClick className="w-4 h-4 text-[#EA580C]" />, highlight: true },
                  { label: 'Waitlist Joined', value: overview.waitlistSubmissions || 0, icon: <Heart className="w-4 h-4 text-[#EC4899]" /> },
                  { label: 'Feedback Given', value: overview.feedbackSubmissions || 0, icon: <MessageSquare className="w-4 h-4 text-[#8B5CF6]" /> },
                  { label: 'Conversion Rate', value: `${overview.conversionRate || 0}%`, icon: <TrendingUp className="w-4 h-4 text-[#10B981]" />, desc: 'Clicks / Unique Visitors' },
                  { label: 'Avg Duration', value: `${overview.avgSessionDuration || 0}s`, icon: <Clock className="w-4 h-4 text-[#F59E0B]" /> },
                  { label: 'Engagement Rate', value: `${overview.engagementRate || 0}%`, icon: <CheckCircle2 className="w-4 h-4 text-[#D97706]" /> },
                ].map((kpi, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border ${
                      kpi.highlight
                        ? 'bg-gradient-to-br from-[#2E1508] to-[#1F0E06] border-[#D97706]/60 shadow-lg'
                        : 'bg-[#190B05] border-[#2E1508]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase text-[#A88B77]">{kpi.label}</span>
                      {kpi.icon}
                    </div>
                    <div className="text-2xl font-black font-mono text-[#FFFBEB]">{kpi.value}</div>
                    {kpi.desc && <div className="text-[10px] text-[#785A48] mt-1">{kpi.desc}</div>}
                  </div>
                ))}
              </div>

              {/* Traffic Chart in Overview */}
              <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#FFFBEB]">Traffic & Intent Activity</h3>
                  <span className="text-xs font-mono text-[#A88B77]">Events Timeline</span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={traffic}>
                      <defs>
                        <linearGradient id="pvColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="ctaColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EA580C" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2E1508" />
                      <XAxis dataKey="label" stroke="#785A48" fontSize={11} />
                      <YAxis stroke="#785A48" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#140803', borderColor: '#3D2517', borderRadius: 12, color: '#FFFBEB', fontSize: 12 }} />
                      <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#F59E0B" fillOpacity={1} fill="url(#pvColor)" />
                      <Area type="monotone" dataKey="ctaClicks" name="Buy CTA Clicks" stroke="#EA580C" strokeWidth={2} fillOpacity={1} fill="url(#ctaColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRAFFIC */}
          {activeTab === 'traffic' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-black">DETAILED TRAFFIC TIMELINE</h2>
              
              <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508]">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={traffic}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2E1508" />
                      <XAxis dataKey="label" stroke="#785A48" fontSize={11} />
                      <YAxis stroke="#785A48" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#140803', borderColor: '#3D2517', borderRadius: 12, color: '#FFFBEB' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="pageViews" name="Page Views" stroke="#F59E0B" strokeWidth={2} />
                      <Line type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#6366F1" strokeWidth={2} />
                      <Line type="monotone" dataKey="ctaClicks" name="Buy Clicks" stroke="#EA580C" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONVERSION FUNNEL */}
          {activeTab === 'funnel' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-black">PRE-LAUNCH CONVERSION FUNNEL</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508]">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnel} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#2E1508" />
                        <XAxis type="number" stroke="#785A48" fontSize={11} />
                        <YAxis dataKey="step" type="category" stroke="#785A48" fontSize={11} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: '#140803', borderColor: '#3D2517', borderRadius: 12, color: '#FFFBEB' }} />
                        <Bar dataKey="count" fill="#D97706" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-4 flex flex-col justify-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">Funnel Step Progression</h3>
                  <div className="space-y-3">
                    {funnel.map((step, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#140803] border border-[#2E1508]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-[#FFFBEB]">{step.step}</span>
                          <span className="font-mono font-bold text-[#F59E0B]">{step.count} ({step.percentage}%)</span>
                        </div>
                        {i > 0 && (
                          <div className="text-[11px] text-[#A88B77]">
                            Drop-off from previous step: <span className="text-red-400 font-bold">{step.dropoff}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT ANALYTICS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-black">PRODUCT INTEREST & CLICK-THROUGH RATE</h2>

              <div className="bg-[#190B05] rounded-3xl border border-[#2E1508] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#140803] text-[#A88B77] uppercase font-mono border-b border-[#2E1508]">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Flavor</th>
                        <th className="p-4 text-center">Product Views</th>
                        <th className="p-4 text-center">Buy/Coming Soon Clicks</th>
                        <th className="p-4 text-center">Unique Viewers</th>
                        <th className="p-4 text-right">Interest Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2E1508]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#1F0E06] transition-colors">
                          <td className="p-4 font-bold text-sm text-[#FFFBEB]">{p.name}</td>
                          <td className="p-4 text-[#F59E0B] font-medium">{p.flavor}</td>
                          <td className="p-4 text-center font-mono">{p.views}</td>
                          <td className="p-4 text-center font-mono font-bold text-[#EA580C]">{p.ctaClicks}</td>
                          <td className="p-4 text-center font-mono">{p.uniqueVisitors}</td>
                          <td className="p-4 text-right font-mono font-black text-[#10B981] text-sm">
                            {p.interestRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TRAFFIC SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-black">TRAFFIC SOURCES & UTM CAMPAIGNS</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">Channel Breakdown</h3>
                  <div className="space-y-3">
                    {sources.sources.map((s, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-[#FFFBEB]">{s.name}</span>
                          <span className="font-mono text-[#A88B77]">{s.count} visits ({s.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-[#140803] rounded-full overflow-hidden">
                          <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${s.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">UTM Campaigns Tracked</h3>
                  {sources.campaigns.length > 0 ? (
                    <div className="space-y-2">
                      {sources.campaigns.map((c, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#140803] border border-[#2E1508] flex justify-between items-center text-xs">
                          <span className="font-mono text-[#F59E0B] font-bold">{c.name}</span>
                          <span className="font-mono text-[#A88B77]">{c.count} visitors</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#785A48] py-8 text-center">No tagged UTM campaigns in this time range.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DEVICES & TECH */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-black">DEVICES, BROWSERS & OS BREAKDOWN</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">Device Category</h3>
                  <div className="space-y-2">
                    {devices.devices.map((d, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#140803] flex justify-between items-center text-xs">
                        <span>{d.name}</span>
                        <span className="font-mono font-bold text-[#D97706]">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">Browser Family</h3>
                  <div className="space-y-2">
                    {devices.browsers.map((b, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#140803] flex justify-between items-center text-xs">
                        <span>{b.name}</span>
                        <span className="font-mono font-bold text-[#D97706]">{b.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">Operating System</h3>
                  <div className="space-y-2">
                    {devices.os.map((o, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#140803] flex justify-between items-center text-xs">
                        <span>{o.name}</span>
                        <span className="font-mono font-bold text-[#D97706]">{o.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: GEOGRAPHIC */}
          {activeTab === 'geo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-display font-black">GEOGRAPHIC ANALYTICS</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">Top Countries</h3>
                  <div className="space-y-2">
                    {geo.countries.map((c, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#140803] flex justify-between items-center text-xs">
                        <span>{c.name}</span>
                        <span className="font-mono font-bold text-[#D97706]">{c.count} visitors</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#190B05] p-6 rounded-3xl border border-[#2E1508] space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">Top Metro Regions</h3>
                  <div className="space-y-2">
                    {geo.cities.map((ct, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#140803] flex justify-between items-center text-xs">
                        <span>{ct.name}</span>
                        <span className="font-mono font-bold text-[#D97706]">{ct.count} visitors</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: FEEDBACK REVIEWS */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-display font-black">CONSUMER FEEDBACK & SUGGESTIONS</h2>
                  <p className="text-xs text-[#A88B77]">Average excitement score: {feedback.averageRating} / 5.0</p>
                </div>
                <button
                  onClick={handleExportFeedback}
                  className="py-2.5 px-4 rounded-xl bg-[#D97706] text-[#190B05] font-black text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Feedback (CSV)</span>
                </button>
              </div>

              {/* Star Distribution */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {feedback.ratingDistribution?.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#190B05] border border-[#2E1508] text-center">
                    <span className="text-xs font-bold text-[#F59E0B]">{r.stars}</span>
                    <div className="text-xl font-mono font-black mt-1">{r.count}</div>
                    <span className="text-[10px] text-[#A88B77]">{r.percentage}%</span>
                  </div>
                ))}
              </div>

              {/* Feedback List */}
              <div className="space-y-3">
                {feedback.feedback && feedback.feedback.length > 0 ? (
                  feedback.feedback.map((f, i) => (
                    <div key={i} className="bg-[#190B05] p-5 rounded-2xl border border-[#2E1508] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#F59E0B]">★ {f.rating} Stars — {f.favoriteFlavor || 'General'}</span>
                        <span className="font-mono text-[#785A48]">{new Date(f.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-[#FFFBEB] leading-relaxed">"{f.feedback}"</p>
                      {(f.name || f.email) && (
                        <div className="text-[11px] text-[#A88B77]">
                          From: {f.name || 'Anonymous'} {f.email && `(${f.email})`}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-[#190B05] rounded-3xl border border-[#2E1508] text-sm text-[#785A48]">
                    No feedback received yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: WAITLIST SUBSCRIBERS */}
          {activeTab === 'waitlist' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-display font-black">VIP WAITLIST SUBSCRIBERS</h2>
                  <p className="text-xs text-[#A88B77]">Total interested customers: {waitlist.length}</p>
                </div>
                <button
                  onClick={handleExportWaitlist}
                  className="py-2.5 px-4 rounded-xl bg-[#D97706] text-[#190B05] font-black text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Waitlist (CSV)</span>
                </button>
              </div>

              <div className="bg-[#190B05] rounded-3xl border border-[#2E1508] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#140803] text-[#A88B77] uppercase font-mono border-b border-[#2E1508]">
                      <tr>
                        <th className="p-4">Email</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Flavor Interest</th>
                        <th className="p-4">City</th>
                        <th className="p-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2E1508]">
                      {waitlist && waitlist.length > 0 ? (
                        waitlist.map((w, i) => (
                          <tr key={i} className="hover:bg-[#1F0E06] transition-colors">
                            <td className="p-4 font-mono font-bold text-[#F59E0B]">{w.email}</td>
                            <td className="p-4 text-[#FFFBEB]">{w.name || '—'}</td>
                            <td className="p-4 font-medium">{w.productInterest}</td>
                            <td className="p-4 text-[#A88B77]">{w.city || '—'}</td>
                            <td className="p-4 font-mono text-[#785A48]">{new Date(w.createdAt || Date.now()).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#785A48]">
                            No waitlist entries yet. Once visitors sign up, they will appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
