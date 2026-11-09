import { Car } from '../models/Car.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const CAR_FIELDS = ['name', 'image', 'capacity', 'fuelType', 'rentPerHour'];

const pickCarFields = (payload) =>
  CAR_FIELDS.reduce((result, field) => {
    if (payload[field] !== undefined) result[field] = payload[field];
    return result;
  }, {});

/**
 * GET /api/cars
 */
export const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find().sort({ createdAt: -1 });
  res.json({ success: true, count: cars.length, data: cars });
});

/**
 * GET /api/cars/:id
 */
export const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  res.json({ success: true, data: car });
});

/**
 * POST /api/cars
 */
export const createCar = asyncHandler(async (req, res) => {
  const car = await Car.create({ ...pickCarFields(req.body), bookedTimeSlots: [] });
  res.status(201).json({ success: true, data: car });
});

/**
 * PUT /api/cars/:id
 */
export const updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, pickCarFields(req.body), {
    new: true,
    runValidators: true,
  });

  if (!car) throw new ApiError(404, 'Car not found');
  res.json({ success: true, data: car });
});

/**
 * DELETE /api/cars/:id
 */
export const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) throw new ApiError(404, 'Car not found');
  res.json({ success: true, message: 'Car deleted successfully' });
});
