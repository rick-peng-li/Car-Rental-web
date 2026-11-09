import { randomUUID } from 'node:crypto';
import { Booking } from '../models/Booking.js';
import { Car } from '../models/Car.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  calculateAmount,
  calculateHours,
  hasConflictingSlot,
} from '../utils/pricing.js';

/**
 * POST /api/bookings
 * Totals are always recalculated on the server so the client cannot fake prices.
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { car: carId, bookedTimeSlots, driverRequired = false } = req.body;
  const { from, to } = bookedTimeSlots || {};

  if (!from || !to || new Date(from) >= new Date(to)) {
    throw new ApiError(400, 'A valid time range is required');
  }

  const car = await Car.findById(carId);
  if (!car) throw new ApiError(404, 'Car not found');

  if (hasConflictingSlot(car.bookedTimeSlots, from, to)) {
    throw new ApiError(409, 'The selected time range is no longer available');
  }

  const totalHours = calculateHours(from, to);
  if (totalHours <= 0) {
    throw new ApiError(400, 'The rental period must be at least one hour');
  }

  const totalAmount = calculateAmount(totalHours, car.rentPerHour, driverRequired);

  const booking = await Booking.create({
    car: car._id,
    user: req.user._id,
    bookedTimeSlots: { from, to },
    totalHours,
    totalAmount,
    driverRequired,
    transactionId: randomUUID(),
  });

  car.bookedTimeSlots.push({ from, to });
  await car.save();

  await booking.populate('car');

  res.status(201).json({ success: true, data: booking });
});

/**
 * GET /api/bookings/my
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('car')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

/**
 * GET /api/bookings  (admin)
 */
export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('car')
    .populate('user', 'username')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

/**
 * DELETE /api/bookings/:id
 * Cancelling releases the reserved time slot back to the car.
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const isOwner = booking.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'You cannot cancel this booking');
  }

  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking is already cancelled');
  }

  booking.status = 'cancelled';
  await booking.save();

  const car = await Car.findById(booking.car);
  if (car) {
    car.bookedTimeSlots = car.bookedTimeSlots.filter(
      (slot) =>
        !(slot.from === booking.bookedTimeSlots.from && slot.to === booking.bookedTimeSlots.to)
    );
    await car.save();
  }

  res.json({ success: true, message: 'Booking cancelled successfully' });
});
