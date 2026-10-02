/**
 * SQIZZY First-Party Analytics Engine
 * Privacy-conscious, non-invasive, high-reliability event tracker.
 */

// Helper to generate RFC4122 UUID
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 1. Visitor ID (persistent across visits)
export function getVisitorId() {
  try {
    let visitorId = localStorage.getItem('sqizzy_visitor_id');
    if (!visitorId) {
      visitorId = 'sqz_vis_' + generateUUID();
      localStorage.setItem('sqizzy_visitor_id', visitorId);
    }
    return visitorId;
  } catch (e) {
    return 'sqz_vis_fallback_' + generateUUID().slice(0, 8);
  }
}

// 2. Session ID (expires after 30 mins of inactivity)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function getSessionId() {
  try {
    const now = Date.now();
    let sessionId = sessionStorage.getItem('sqizzy_session_id');
    const lastActiveStr = sessionStorage.getItem('sqizzy_session_last_active');

    if (sessionId && lastActiveStr) {
      const lastActive = parseInt(lastActiveStr, 10);
      if (now - lastActive > SESSION_TIMEOUT_MS) {
        // Session expired, create new session
        sessionId = 'sqz_ses_' + generateUUID();
      }
    } else {
      sessionId = 'sqz_ses_' + generateUUID();
    }

    sessionStorage.setItem('sqizzy_session_id', sessionId);
    sessionStorage.setItem('sqizzy_session_last_active', now.toString());
    return sessionId;
  } catch (e) {
    return 'sqz_ses_fallback_' + generateUUID().slice(0, 8);
  }
}

// 3. Device & Environment Detection
export function getClientEnvironment() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  
  // Device Type
  let deviceType = 'desktop';
  if (/iPad|tablet|(android(?!.*mobile))/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    deviceType = 'mobile';
  }

  // OS
  let os = 'Other';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Other';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';

  // Screen
  const screen = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '';

  return { type: deviceType, os, browser, screen };
}

// 4. UTM Parameter Extraction
export function getUtmParams() {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || '',
      term: params.get('utm_term') || '',
      content: params.get('utm_content') || ''
    };

    // Store in session storage if present
    if (utm.source || utm.campaign) {
      sessionStorage.setItem('sqizzy_utm', JSON.stringify(utm));
      return utm;
    }

    const cached = sessionStorage.getItem('sqizzy_utm');
    return cached ? JSON.parse(cached) : utm;
  } catch (e) {
    return {};
  }
}

// 5. Core Dispatcher with Beacon & Fetch Keepalive
const API_URL = import.meta.env.VITE_API_URL || '';

export async function sendAnalyticsEvent(eventName, payload = {}) {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const device = getClientEnvironment();
    const utm = getUtmParams();

    const fullPayload = {
      event: eventName,
      visitorId,
      sessionId,
      page: payload.page || window.location.pathname || '/',
      referrer: document.referrer || '',
      productId: payload.productId || null,
      productSlug: payload.productSlug || null,
      location: payload.location || '',
      ctaText: payload.ctaText || '',
      device,
      utm,
      metadata: payload.metadata || {},
      timestamp: new Date().toISOString()
    };

    const endpoint = `${API_URL}/api/analytics/events`;
    const jsonString = JSON.stringify(fullPayload);

    // Try navigator.sendBeacon
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const beaconSent = navigator.sendBeacon(endpoint, blob);
      if (beaconSent) return;
    }

    // Fallback to fetch with keepalive
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonString,
      keepalive: true,
      credentials: 'omit'
    }).catch(() => {
      // Fire-and-forget: fail silently so UX is NEVER impacted
    });
  } catch (err) {
    // Non-blocking catch
  }
}

// 6. High-Level Helper Functions
let lastTrackedPage = '';

export function trackPageView(path, title) {
  if (lastTrackedPage === path) return; // prevent instant React re-render duplicates
  lastTrackedPage = path;

  sendAnalyticsEvent('page_view', {
    page: path,
    metadata: { title: title || document.title }
  });
}

export function trackProductView(product) {
  sendAnalyticsEvent('product_view', {
    productId: product.slug || product.id,
    productSlug: product.slug,
    page: window.location.pathname,
    metadata: { productName: product.name, flavor: product.flavor }
  });
}

export function trackProductCtaClick(product, location = 'product_card', ctaText = 'Coming Soon') {
  sendAnalyticsEvent('product_cta_click', {
    productId: product.slug || product.id || 'general',
    productSlug: product.slug || 'general',
    location,
    ctaText,
    metadata: { productName: product.name }
  });
}

export function trackHeroCtaClick(ctaText, targetLocation = 'hero') {
  sendAnalyticsEvent('hero_cta_click', {
    location: targetLocation,
    ctaText
  });
}

export function trackWaitlistOpen(source = 'button') {
  sendAnalyticsEvent('waitlist_open', { location: source });
}

export function trackWaitlistSubmit(email, flavor) {
  sendAnalyticsEvent('waitlist_submit', {
    metadata: { emailHashed: !!email, flavor }
  });
}

export function trackFeedbackOpen() {
  sendAnalyticsEvent('feedback_open');
}

export function trackFeedbackSubmit(rating) {
  sendAnalyticsEvent('feedback_submit', {
    metadata: { rating }
  });
}

export function trackFaqInteraction(questionId, action = 'expand') {
  sendAnalyticsEvent('faq_interaction', {
    metadata: { questionId, action }
  });
}

export function trackRecipeClick(recipeName) {
  sendAnalyticsEvent('recipe_click', {
    metadata: { recipe: recipeName }
  });
}

export function trackContactSubmit() {
  sendAnalyticsEvent('contact_submit');
}

// 7. Scroll Depth Milestones Listener (25%, 50%, 75%, 90%)
export function initScrollTracker() {
  if (typeof window === 'undefined') return;

  const milestones = { 25: false, 50: false, 75: false, 90: false };

  const onScroll = () => {
    const h = document.documentElement;
    const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';

    const scrollPercent = Math.round(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100);

    [25, 50, 75, 90].forEach(milestone => {
      if (scrollPercent >= milestone && !milestones[milestone]) {
        milestones[milestone] = true;
        sendAnalyticsEvent('scroll_depth', {
          page: window.location.pathname,
          metadata: { depth: milestone }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}
