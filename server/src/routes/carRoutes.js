import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const carRules = [
  body('name').trim().notEmpty().withMessage('Car name is required'),
  body('image').trim().isURL().withMessage('A valid image url is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  body('fuelType').trim().notEmpty().withMessage('Fuel type is required'),
  body('rentPerHour')
    .isFloat({ min: 0 })
    .withMessage('Rent per hour must be a positive number'),
];

router.get('/', getCars);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid car id')], validate, getCarById);

router.post('/', protect, adminOnly, carRules, validate, createCar);
router.put(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('Invalid car id')],
  validate,
  updateCar
);
router.delete(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('Invalid car id')],
  validate,
  deleteCar
);

export default router;
