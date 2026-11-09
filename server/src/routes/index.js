import { Router } from 'express';
import authRoutes from './authRoutes.js';
import carRoutes from './carRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Car Rental API is running' });
});

router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/bookings', bookingRoutes);

export default router;
