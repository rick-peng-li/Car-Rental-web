export const DRIVER_RATE_PER_HOUR = 30;

/**
 * Two ranges overlap when each one starts before the other one ends.
 */
export const isOverlapping = (aFrom, aTo, bFrom, bTo) =>
  new Date(aFrom) < new Date(bTo) && new Date(bFrom) < new Date(aTo);

export const hasConflictingSlot = (bookedTimeSlots, from, to) =>
  bookedTimeSlots.some((slot) => isOverlapping(from, to, slot.from, slot.to));

export const calculateHours = (from, to) => {
  const start = new Date(from);
  const end = new Date(to);
  // Compare at minute precision so stray seconds/milliseconds never bump the hour count
  start.setSeconds(0, 0);
  end.setSeconds(0, 0);
  const minutes = (end - start) / (1000 * 60);
  return Math.max(0, Math.ceil(minutes / 60));
};

export const calculateAmount = (hours, rentPerHour, driverRequired) => {
  const driverFee = driverRequired ? DRIVER_RATE_PER_HOUR * hours : 0;
  return hours * rentPerHour + driverFee;
};
