import { Router } from 'express';
import { submitContact } from '../controllers/contactController.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();
router.post('/', formRateLimiter, submitContact);

export default router;
