import { Router } from 'express';
import {
  trackEvent,
  getOverview,
  getTraffic,
  getFunnel,
  getProductsOverview,
  getSources,
  getDevices,
  getGeo,
  getWaitlistSubmissions,
  getFeedbackSubmissions,
  exportWaitlistCSV,
  exportFeedbackCSV
} from '../controllers/analyticsController.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { analyticsRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public event collection
router.post('/events', analyticsRateLimiter, trackEvent);

// Protected Admin Analytics Dashboard APIs
router.get('/overview', requireAdminAuth, getOverview);
router.get('/traffic', requireAdminAuth, getTraffic);
router.get('/funnel', requireAdminAuth, getFunnel);
router.get('/products', requireAdminAuth, getProductsOverview);
router.get('/sources', requireAdminAuth, getSources);
router.get('/devices', requireAdminAuth, getDevices);
router.get('/geo', requireAdminAuth, getGeo);
router.get('/waitlist', requireAdminAuth, getWaitlistSubmissions);
router.get('/feedback', requireAdminAuth, getFeedbackSubmissions);

// Protected CSV Exports
router.get('/export/waitlist', requireAdminAuth, exportWaitlistCSV);
router.get('/export/feedback', requireAdminAuth, exportFeedbackCSV);

export default router;
