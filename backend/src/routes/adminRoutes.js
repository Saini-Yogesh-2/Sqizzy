import { Router } from 'express';
import { loginAdmin, logoutAdmin, checkAdminSession } from '../controllers/adminController.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', loginRateLimiter, loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/session', checkAdminSession);

export default router;
