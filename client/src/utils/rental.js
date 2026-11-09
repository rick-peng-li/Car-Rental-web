import dayjs from 'dayjs';
import { DRIVER_RATE_PER_HOUR } from './constants';

export const isOverlapping = (aFrom, aTo, bFrom, bTo) =>
  new Date(aFrom) < new Date(bTo) && new Date(bFrom) < new Date(aTo);

export const isCarAvailable = (car, from, to) =>
  !car.bookedTimeSlots?.some((slot) => isOverlapping(from, to, slot.from, slot.to));

/**
 * Return only the cars that are free for the selected rental window.
 */
export const filterAvailableCars = (cars, from, to) => {
  if (!from || !to) return cars;
  return cars.filter((car) => isCarAvailable(car, from.toDate(), to.toDate()));
};

export const calculateRentalHours = (from, to) => {
  if (!from || !to) return 0;
  // Compare at minute precision so stray seconds/milliseconds never bump the hour count
  const start = dayjs(from).startOf('minute');
  const end = dayjs(to).startOf('minute');
  const minutes = end.diff(start, 'minute');
  return Math.max(0, Math.ceil(minutes / 60));
};

export const calculateTotalAmount = ({ hours, rentPerHour, driverRequired }) => {
  const driverFee = driverRequired ? DRIVER_RATE_PER_HOUR * hours : 0;
  return hours * rentPerHour + driverFee;
};

/**
 * Validate the rental window and return a readable message when invalid.
 */
export const getRangeError = (from, to) => {
  if (!from || !to) return null;
  if (!dayjs(to).isAfter(dayjs(from))) return 'The return time must be after the pick-up time.';
  if (calculateRentalHours(from, to) < 1) return 'The rental period must be at least one hour.';
  return null;
};

export const formatSlot = (slot) => `${slot.from} → ${slot.to}`;

export const formatDate = (value) => dayjs(value).format('MMM DD, YYYY');
