import { z } from 'zod';
import {
  recordAnalyticsEvent,
  getOverviewKPIs,
  getTrafficTimeline,
  getConversionFunnel,
  getProductAnalytics,
  getTrafficSources,
  getDeviceBreakdown,
  getGeoBreakdown
} from '../services/analyticsStore.js';
import { Waitlist } from '../models/Waitlist.js';
import { Feedback } from '../models/Feedback.js';
import { getIsConnected } from '../config/db.js';
import { getMemoryStore } from '../services/analyticsStore.js';

const eventSchema = z.object({
  event: z.string().min(1),
  visitorId: z.string().min(1),
  sessionId: z.string().min(1),
  page: z.string().default('/'),
  referrer: z.string().optional().default(''),
  productId: z.string().nullable().optional(),
  productSlug: z.string().nullable().optional(),
  location: z.string().optional().default(''),
  ctaText: z.string().optional().default(''),
  device: z.object({
    type: z.string().optional().default('desktop'),
    os: z.string().optional().default('Unknown'),
    browser: z.string().optional().default('Unknown'),
    screen: z.string().optional().default('')
  }).optional().default({}),
  utm: z.object({
    source: z.string().optional().default(''),
    medium: z.string().optional().default(''),
    campaign: z.string().optional().default(''),
    term: z.string().optional().default(''),
    content: z.string().optional().default('')
  }).optional().default({}),
  geo: z.object({
    country: z.string().optional().default('United States'),
    region: z.string().optional().default('California'),
    city: z.string().optional().default('San Francisco')
  }).optional().default({}),
  metadata: z.record(z.any()).optional().default({})
});

export const trackEvent = async (req, res, next) => {
  try {
    const parseResult = eventSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid analytics payload',
        details: parseResult.error.format()
      });
    }

    await recordAnalyticsEvent(parseResult.data);
    return res.status(200).json({ success: true, recorded: true });
  } catch (error) {
    // Non-blocking response
    console.error('Analytics tracking error:', error);
    return res.status(200).json({ success: false, error: 'Tracking logged' });
  }
};

export const getOverview = async (req, res, next) => {
  try {
    const { range = '7d', start, end } = req.query;
    const data = await getOverviewKPIs(range, start, end);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTraffic = async (req, res, next) => {
  try {
    const { range = '7d', start, end } = req.query;
    const data = await getTrafficTimeline(range, start, end);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getFunnel = async (req, res, next) => {
  try {
    const { range = '7d', start, end } = req.query;
    const data = await getConversionFunnel(range, start, end);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProductsOverview = async (req, res, next) => {
  try {
    const { range = '7d', start, end } = req.query;
    const data = await getProductAnalytics(range, start, end);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSources = async (req, res, next) => {
  try {
    const { range = '7d', start, end } = req.query;
    const data = await getTrafficSources(range, start, end);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getDevices = async (req, res, next) => {
  try {
    const { range = '7d', start, end } = req.query;
    const data = await getDeviceBreakdown(range, start, end);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getGeo = async (req, res, next) => {
  try {
    const { range = '7d', start, end } = req.query;
    const data = await getGeoBreakdown(range, start, end);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getWaitlistSubmissions = async (req, res, next) => {
  try {
    let list = [];
    if (getIsConnected()) {
      list = await Waitlist.find().sort({ createdAt: -1 }).lean();
    } else {
      list = getMemoryStore().waitlist;
    }
    return res.json({ success: true, data: list, count: list.length });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackSubmissions = async (req, res, next) => {
  try {
    let list = [];
    if (getIsConnected()) {
      list = await Feedback.find().sort({ createdAt: -1 }).lean();
    } else {
      list = getMemoryStore().feedback;
    }

    const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sumRating = 0;

    list.forEach(f => {
      const r = Math.min(5, Math.max(1, f.rating || 5));
      ratingsCount[r] = (ratingsCount[r] || 0) + 1;
      sumRating += r;
    });

    const averageRating = list.length > 0 ? (sumRating / list.length).toFixed(1) : '5.0';

    return res.json({
      success: true,
      data: {
        feedback: list,
        count: list.length,
        averageRating: Number(averageRating),
        ratingDistribution: Object.entries(ratingsCount).map(([stars, count]) => ({
          stars: `${stars} Stars`,
          count,
          percentage: list.length > 0 ? Math.round((count / list.length) * 100) : 0
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// CSV Export Handlers
export const exportWaitlistCSV = async (req, res, next) => {
  try {
    let list = [];
    if (getIsConnected()) {
      list = await Waitlist.find().sort({ createdAt: -1 }).lean();
    } else {
      list = getMemoryStore().waitlist;
    }

    const headers = ['Email', 'Name', 'Product Interest', 'City', 'Source', 'Date'];
    const rows = list.map(item => [
      `"${item.email || ''}"`,
      `"${item.name || ''}"`,
      `"${item.productInterest || ''}"`,
      `"${item.city || ''}"`,
      `"${item.source || ''}"`,
      `"${new Date(item.createdAt || Date.now()).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sqizzy-waitlist-export.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const exportFeedbackCSV = async (req, res, next) => {
  try {
    let list = [];
    if (getIsConnected()) {
      list = await Feedback.find().sort({ createdAt: -1 }).lean();
    } else {
      list = getMemoryStore().feedback;
    }

    const headers = ['Rating', 'Feedback', 'Favorite Flavor', 'Name', 'Email', 'Age Range', 'Date'];
    const rows = list.map(item => [
      `"${item.rating || 5}"`,
      `"${(item.feedback || '').replace(/"/g, '""')}"`,
      `"${item.favoriteFlavor || ''}"`,
      `"${item.name || ''}"`,
      `"${item.email || ''}"`,
      `"${item.ageRange || ''}"`,
      `"${new Date(item.createdAt || Date.now()).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sqizzy-feedback-export.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
