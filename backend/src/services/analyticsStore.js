import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { Visitor } from '../models/Visitor.js';
import { Session } from '../models/Session.js';
import { Feedback } from '../models/Feedback.js';
import { Waitlist } from '../models/Waitlist.js';
import { Product } from '../models/Product.js';
import { getIsConnected } from '../config/db.js';
import { initialProducts } from '../utils/seedData.js';

// In-Memory Fallback State (Ensures instant 100% functionality everywhere)
const memoryStore = {
  events: [],
  visitors: new Map(),
  sessions: new Map(),
  feedback: [],
  waitlist: [],
  products: [...initialProducts],
  contacts: []
};

// Seed initial products into memoryStore
export const getMemoryStore = () => memoryStore;

// Track an event
export const recordAnalyticsEvent = async (eventData) => {
  const {
    event,
    visitorId,
    sessionId,
    page = '/',
    referrer = '',
    productId = null,
    productSlug = null,
    location = '',
    ctaText = '',
    device = {},
    utm = {},
    geo = {},
    metadata = {}
  } = eventData;

  const timestamp = new Date();
  const eventDoc = {
    event,
    visitorId,
    sessionId,
    page,
    referrer,
    productId,
    productSlug,
    location,
    ctaText,
    device: {
      type: device.type || 'desktop',
      os: device.os || 'Unknown',
      browser: device.browser || 'Unknown',
      screen: device.screen || ''
    },
    utm: {
      source: utm.source || '',
      medium: utm.medium || '',
      campaign: utm.campaign || '',
      term: utm.term || '',
      content: utm.content || ''
    },
    geo: {
      country: geo.country || 'United States',
      region: geo.region || 'California',
      city: geo.city || 'San Francisco'
    },
    metadata,
    timestamp
  };

  // 1. Update in-memory visitor
  if (!memoryStore.visitors.has(visitorId)) {
    memoryStore.visitors.set(visitorId, {
      visitorId,
      firstSeen: timestamp,
      lastSeen: timestamp,
      totalSessions: 1,
      totalPageViews: event === 'page_view' ? 1 : 0,
      device: eventDoc.device,
      geo: eventDoc.geo,
      initialReferrer: referrer,
      initialUtm: eventDoc.utm
    });
  } else {
    const v = memoryStore.visitors.get(visitorId);
    v.lastSeen = timestamp;
    if (event === 'page_view') v.totalPageViews += 1;
  }

  // 2. Update in-memory session
  if (!memoryStore.sessions.has(sessionId)) {
    memoryStore.sessions.set(sessionId, {
      sessionId,
      visitorId,
      startTime: timestamp,
      lastActive: timestamp,
      durationSeconds: 0,
      pageViewsCount: event === 'page_view' ? 1 : 0,
      pagesVisited: [page],
      ctaClicksCount: event === 'product_cta_click' || event === 'hero_cta_click' ? 1 : 0,
      referrer,
      utm: eventDoc.utm,
      device: eventDoc.device
    });
  } else {
    const s = memoryStore.sessions.get(sessionId);
    s.lastActive = timestamp;
    s.durationSeconds = Math.max(0, Math.floor((timestamp - new Date(s.startTime)) / 1000));
    if (event === 'page_view') {
      s.pageViewsCount += 1;
      if (!s.pagesVisited.includes(page)) s.pagesVisited.push(page);
    }
    if (event === 'product_cta_click' || event === 'hero_cta_click') {
      s.ctaClicksCount += 1;
    }
  }

  // 3. Store event in memory (retain last 10,000 events)
  memoryStore.events.push(eventDoc);
  if (memoryStore.events.length > 10000) {
    memoryStore.events.shift();
  }

  // 4. If MongoDB is connected, asynchronously persist to database
  if (getIsConnected()) {
    try {
      await AnalyticsEvent.create(eventDoc);
      await Visitor.findOneAndUpdate(
        { visitorId },
        {
          $set: {
            lastSeen: timestamp,
            device: eventDoc.device,
            geo: eventDoc.geo
          },
          $inc: { totalPageViews: event === 'page_view' ? 1 : 0 },
          $setOnInsert: {
            firstSeen: timestamp,
            totalSessions: 1,
            initialReferrer: referrer,
            initialUtm: eventDoc.utm
          }
        },
        { upsert: true }
      );
      await Session.findOneAndUpdate(
        { sessionId },
        {
          $set: {
            lastActive: timestamp,
            device: eventDoc.device
          },
          $inc: {
            pageViewsCount: event === 'page_view' ? 1 : 0,
            ctaClicksCount: (event === 'product_cta_click' || event === 'hero_cta_click') ? 1 : 0
          },
          $addToSet: { pagesVisited: page },
          $setOnInsert: {
            visitorId,
            startTime: timestamp,
            referrer,
            utm: eventDoc.utm
          }
        },
        { upsert: true }
      );
    } catch (dbErr) {
      console.error('MongoDB async analytics write error:', dbErr.message);
    }
  }

  return { success: true };
};

// Calculate Date Window helper
const getDateWindow = (range = '7d', customStart = null, customEnd = null) => {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      now.setDate(now.getDate() - 1);
      now.setHours(23, 59, 59, 999);
      break;
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case 'custom':
      if (customStart) startDate = new Date(customStart);
      if (customEnd) now.setTime(new Date(customEnd).getTime());
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
  }

  return { startDate, endDate: now };
};

// Get Dashboard Overview KPIs
export const getOverviewKPIs = async (range = '7d', customStart = null, customEnd = null) => {
  const { startDate, endDate } = getDateWindow(range, customStart, customEnd);

  let events = [];
  let visitorsCount = 0;
  let sessionsList = [];
  let waitlistCount = 0;
  let feedbackCount = 0;

  if (getIsConnected()) {
    try {
      events = await AnalyticsEvent.find({ timestamp: { $gte: startDate, $lte: endDate } }).lean();
      visitorsCount = await Visitor.countDocuments({ lastSeen: { $gte: startDate, $lte: endDate } });
      sessionsList = await Session.find({ startTime: { $gte: startDate, $lte: endDate } }).lean();
      waitlistCount = await Waitlist.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
      feedbackCount = await Feedback.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
    } catch (e) {
      console.warn('Falling back to memory store for overview:', e.message);
    }
  }

  // Fallback to memory
  if (!events || events.length === 0) {
    events = memoryStore.events.filter(e => {
      const t = new Date(e.timestamp);
      return t >= startDate && t <= endDate;
    });
    const uniqueVis = new Set(events.map(e => e.visitorId));
    visitorsCount = uniqueVis.size || (memoryStore.visitors.size > 0 ? memoryStore.visitors.size : 0);
    sessionsList = Array.from(memoryStore.sessions.values()).filter(s => {
      const t = new Date(s.startTime);
      return t >= startDate && t <= endDate;
    });
    waitlistCount = memoryStore.waitlist.filter(w => {
      const t = new Date(w.createdAt || Date.now());
      return t >= startDate && t <= endDate;
    }).length;
    feedbackCount = memoryStore.feedback.filter(f => {
      const t = new Date(f.createdAt || Date.now());
      return t >= startDate && t <= endDate;
    }).length;
  }

  const pageViews = events.filter(e => e.event === 'page_view').length;
  const productViews = events.filter(e => e.event === 'product_view').length;
  const buyClicks = events.filter(e => e.event === 'product_cta_click' || e.event === 'hero_cta_click').length;
  const uniqueVisitorIds = new Set(events.map(e => e.visitorId)).size || visitorsCount;
  const totalSessions = sessionsList.length || new Set(events.map(e => e.sessionId)).size;

  let totalDuration = 0;
  sessionsList.forEach(s => {
    totalDuration += (s.durationSeconds || 0);
  });
  const avgSessionDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

  // Conversion rate: Buy CTA clicks / Unique Visitors
  const conversionRate = uniqueVisitorIds > 0 ? ((buyClicks / uniqueVisitorIds) * 100).toFixed(1) : 0;

  // Engagement rate: sessions with > 1 page view or CTA click / total sessions
  const engagedSessions = sessionsList.filter(s => (s.pageViewsCount > 1 || s.ctaClicksCount > 0)).length;
  const engagementRate = totalSessions > 0 ? ((engagedSessions / totalSessions) * 100).toFixed(1) : 0;

  return {
    totalVisitors: uniqueVisitorIds,
    uniqueVisitors: uniqueVisitorIds,
    totalSessions,
    pageViews,
    productViews,
    buyClicks,
    waitlistSubmissions: waitlistCount,
    feedbackSubmissions: feedbackCount,
    avgSessionDuration,
    conversionRate: Number(conversionRate),
    engagementRate: Number(engagementRate),
    dateRange: {
      range,
      start: startDate.toISOString(),
      end: endDate.toISOString()
    }
  };
};

// Get Traffic Timeline (by day)
export const getTrafficTimeline = async (range = '7d', customStart = null, customEnd = null) => {
  const { startDate, endDate } = getDateWindow(range, customStart, customEnd);
  
  let events = [];
  if (getIsConnected()) {
    try {
      events = await AnalyticsEvent.find({ timestamp: { $gte: startDate, $lte: endDate } }).lean();
    } catch (e) {
      console.warn('Traffic query fallback to memory:', e.message);
    }
  }

  if (!events || events.length === 0) {
    events = memoryStore.events.filter(e => {
      const t = new Date(e.timestamp);
      return t >= startDate && t <= endDate;
    });
  }

  // Bucket by day
  const dayBuckets = new Map();
  const cur = new Date(startDate);
  while (cur <= endDate) {
    const key = cur.toISOString().split('T')[0];
    dayBuckets.set(key, {
      date: key,
      label: new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews: 0,
      visitors: new Set(),
      sessions: new Set(),
      ctaClicks: 0
    });
    cur.setDate(cur.getDate() + 1);
  }

  events.forEach(e => {
    const day = new Date(e.timestamp).toISOString().split('T')[0];
    if (dayBuckets.has(day)) {
      const bucket = dayBuckets.get(day);
      if (e.event === 'page_view') bucket.pageViews += 1;
      if (e.event === 'product_cta_click' || e.event === 'hero_cta_click') bucket.ctaClicks += 1;
      bucket.visitors.add(e.visitorId);
      bucket.sessions.add(e.sessionId);
    }
  });

  return Array.from(dayBuckets.values()).map(b => ({
    date: b.date,
    label: b.label,
    pageViews: b.pageViews,
    visitors: b.visitors.size,
    sessions: b.sessions.size,
    ctaClicks: b.ctaClicks
  }));
};

// Get Conversion Funnel
export const getConversionFunnel = async (range = '7d', customStart = null, customEnd = null) => {
  const { startDate, endDate } = getDateWindow(range, customStart, customEnd);

  let events = memoryStore.events.filter(e => {
    const t = new Date(e.timestamp);
    return t >= startDate && t <= endDate;
  });

  if (getIsConnected()) {
    try {
      events = await AnalyticsEvent.find({ timestamp: { $gte: startDate, $lte: endDate } }).lean();
    } catch (e) {
      // fallback
    }
  }

  const uniqueVisitors = new Set(events.map(e => e.visitorId)).size;
  const productViewVisitors = new Set(events.filter(e => e.event === 'product_view').map(e => e.visitorId)).size;
  const ctaClickVisitors = new Set(events.filter(e => e.event === 'product_cta_click' || e.event === 'hero_cta_click').map(e => e.visitorId)).size;
  const waitlistVisitors = new Set(events.filter(e => e.event === 'waitlist_submit').map(e => e.visitorId)).size;

  const step1 = uniqueVisitors;
  const step2 = productViewVisitors;
  const step3 = ctaClickVisitors;
  const step4 = waitlistVisitors;

  return [
    { step: 'Visitors', count: step1, percentage: 100, dropoff: step1 > 0 ? (((step1 - step2) / step1) * 100).toFixed(1) : 0 },
    { step: 'Product Views', count: step2, percentage: step1 > 0 ? ((step2 / step1) * 100).toFixed(1) : 0, dropoff: step2 > 0 ? (((step2 - step3) / step2) * 100).toFixed(1) : 0 },
    { step: 'Buy CTA Clicks', count: step3, percentage: step1 > 0 ? ((step3 / step1) * 100).toFixed(1) : 0, dropoff: step3 > 0 ? (((step3 - step4) / step3) * 100).toFixed(1) : 0 },
    { step: 'Waitlist Joined', count: step4, percentage: step1 > 0 ? ((step4 / step1) * 100).toFixed(1) : 0, dropoff: 0 }
  ];
};

// Get Product Analytics
export const getProductAnalytics = async (range = '7d', customStart = null, customEnd = null) => {
  const { startDate, endDate } = getDateWindow(range, customStart, customEnd);
  const products = initialProducts;

  let events = memoryStore.events.filter(e => {
    const t = new Date(e.timestamp);
    return t >= startDate && t <= endDate;
  });

  if (getIsConnected()) {
    try {
      events = await AnalyticsEvent.find({ timestamp: { $gte: startDate, $lte: endDate } }).lean();
    } catch (e) {
      // fallback
    }
  }

  return products.map(prod => {
    const prodEvents = events.filter(e => e.productId === prod.slug || e.productSlug === prod.slug || (e.page && e.page.includes(prod.slug)));
    const views = prodEvents.filter(e => e.event === 'product_view').length;
    const ctaClicks = prodEvents.filter(e => e.event === 'product_cta_click').length;
    const uniqueVisitors = new Set(prodEvents.map(e => e.visitorId)).size;
    const interestRate = views > 0 ? ((ctaClicks / views) * 100).toFixed(1) : 0;

    return {
      id: prod.slug,
      name: prod.name,
      flavor: prod.flavor,
      views,
      ctaClicks,
      uniqueVisitors,
      interestRate: Number(interestRate),
      badge: prod.badge,
      image: prod.images.bottle
    };
  });
};

// Get Traffic Sources & UTM breakdown
export const getTrafficSources = async (range = '7d', customStart = null, customEnd = null) => {
  const { startDate, endDate } = getDateWindow(range, customStart, customEnd);

  let events = memoryStore.events.filter(e => {
    const t = new Date(e.timestamp);
    return t >= startDate && t <= endDate;
  });

  if (getIsConnected()) {
    try {
      events = await AnalyticsEvent.find({ timestamp: { $gte: startDate, $lte: endDate } }).lean();
    } catch (e) {
      // fallback
    }
  }

  const sourcesCount = {
    'Direct': 0,
    'Google': 0,
    'Instagram': 0,
    'Facebook': 0,
    'YouTube': 0,
    'LinkedIn': 0,
    'Referral': 0,
    'Other': 0
  };

  const utmCampaigns = {};

  const seenVisitors = new Set();
  events.forEach(e => {
    if (!seenVisitors.has(e.visitorId)) {
      seenVisitors.add(e.visitorId);
      const ref = (e.referrer || '').toLowerCase();
      const utmSrc = (e.utm?.source || '').toLowerCase();
      const campaign = e.utm?.campaign;

      if (campaign) {
        utmCampaigns[campaign] = (utmCampaigns[campaign] || 0) + 1;
      }

      if (utmSrc.includes('instagram') || ref.includes('instagram.com')) sourcesCount['Instagram'] += 1;
      else if (utmSrc.includes('google') || ref.includes('google.com') || ref.includes('google.')) sourcesCount['Google'] += 1;
      else if (utmSrc.includes('facebook') || ref.includes('facebook.com') || ref.includes('fb.me')) sourcesCount['Facebook'] += 1;
      else if (utmSrc.includes('youtube') || ref.includes('youtube.com') || ref.includes('youtu.be')) sourcesCount['YouTube'] += 1;
      else if (utmSrc.includes('linkedin') || ref.includes('linkedin.com')) sourcesCount['LinkedIn'] += 1;
      else if (ref && !ref.includes(process.env.FRONTEND_URL || 'localhost')) sourcesCount['Referral'] += 1;
      else if (!ref && !utmSrc) sourcesCount['Direct'] += 1;
      else sourcesCount['Other'] += 1;
    }
  });

  const total = Object.values(sourcesCount).reduce((a, b) => a + b, 0) || 1;

  const sourcesList = Object.entries(sourcesCount).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100)
  })).sort((a, b) => b.count - a.count);

  return {
    sources: sourcesList,
    campaigns: Object.entries(utmCampaigns).map(([name, count]) => ({ name, count }))
  };
};

// Get Device, Browser, and OS Breakdown
export const getDeviceBreakdown = async (range = '7d', customStart = null, customEnd = null) => {
  const { startDate, endDate } = getDateWindow(range, customStart, customEnd);

  let events = memoryStore.events.filter(e => {
    const t = new Date(e.timestamp);
    return t >= startDate && t <= endDate;
  });

  if (getIsConnected()) {
    try {
      events = await AnalyticsEvent.find({ timestamp: { $gte: startDate, $lte: endDate } }).lean();
    } catch (e) {
      // fallback
    }
  }

  const devices = { mobile: 0, desktop: 0, tablet: 0 };
  const browsers = { Chrome: 0, Safari: 0, Firefox: 0, Edge: 0, Other: 0 };
  const os = { Windows: 0, macOS: 0, iOS: 0, Android: 0, Linux: 0, Other: 0 };

  const uniqueVisitors = new Set();

  events.forEach(e => {
    if (!uniqueVisitors.has(e.visitorId)) {
      uniqueVisitors.add(e.visitorId);

      const devType = (e.device?.type || 'desktop').toLowerCase();
      if (devType.includes('mobile')) devices.mobile += 1;
      else if (devType.includes('tablet')) devices.tablet += 1;
      else devices.desktop += 1;

      const br = e.device?.browser || 'Other';
      if (br.includes('Chrome')) browsers.Chrome += 1;
      else if (br.includes('Safari')) browsers.Safari += 1;
      else if (br.includes('Firefox')) browsers.Firefox += 1;
      else if (br.includes('Edge')) browsers.Edge += 1;
      else browsers.Other += 1;

      const o = e.device?.os || 'Other';
      if (o.includes('Windows')) os.Windows += 1;
      else if (o.includes('Mac')) os.macOS += 1;
      else if (o.includes('iOS')) os.iOS += 1;
      else if (o.includes('Android')) os.Android += 1;
      else if (o.includes('Linux')) os.Linux += 1;
      else os.Other += 1;
    }
  });

  return {
    devices: Object.entries(devices).map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count })),
    browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })),
    os: Object.entries(os).map(([name, count]) => ({ name, count }))
  };
};

// Get Geographic Breakdown
export const getGeoBreakdown = async (range = '7d', customStart = null, customEnd = null) => {
  const { startDate, endDate } = getDateWindow(range, customStart, customEnd);

  let events = memoryStore.events.filter(e => {
    const t = new Date(e.timestamp);
    return t >= startDate && t <= endDate;
  });

  if (getIsConnected()) {
    try {
      events = await AnalyticsEvent.find({ timestamp: { $gte: startDate, $lte: endDate } }).lean();
    } catch (e) {
      // fallback
    }
  }

  const countries = {};
  const cities = {};
  const seen = new Set();

  events.forEach(e => {
    if (!seen.has(e.visitorId)) {
      seen.add(e.visitorId);
      const c = e.geo?.country || 'United States';
      const city = e.geo?.city ? `${e.geo.city}, ${e.geo.region || ''}` : 'Unknown';

      countries[c] = (countries[c] || 0) + 1;
      if (city !== 'Unknown') {
        cities[city] = (cities[city] || 0) + 1;
      }
    }
  });

  return {
    countries: Object.entries(countries).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    cities: Object.entries(cities).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10)
  };
};
