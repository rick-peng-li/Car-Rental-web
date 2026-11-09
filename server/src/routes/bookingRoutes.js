import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createBooking,
  getMyBookings,
  getBookings,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  protect,
  [
    body('car').isMongoId().withMessage('A valid car is required'),
    body('bookedTimeSlots.from').notEmpty().withMessage('Start time is required'),
    body('bookedTimeSlots.to').notEmpty().withMessage('End time is required'),
  ],
  validate,
  createBooking
);

router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getBookings);
router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid booking id')],
  validate,
  cancelBooking
);

export default router;
