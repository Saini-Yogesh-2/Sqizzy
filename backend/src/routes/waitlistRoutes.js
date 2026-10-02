import { Router } from 'express';
import { joinWaitlist } from '../controllers/waitlistController.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();
router.post('/', formRateLimiter, joinWaitlist);

export default router;
