import { useMemo, useState } from 'react';
import { calculateRentalHours, calculateTotalAmount } from '@/utils/rental';

/**
 * Quote calculation for the booking page. Values are display-only —
 * the server always recalculates the real amount.
 */
export const useBookingQuote = (car, from, to, driverRequired) => {
  const [showPayment, setShowPayment] = useState(false);

  const hours = useMemo(() => calculateRentalHours(from, to), [from, to]);

  const totalAmount = useMemo(
    () =>
      calculateTotalAmount({
        hours,
        rentPerHour: car?.rentPerHour || 0,
        driverRequired,
      }),
    [hours, car?.rentPerHour, driverRequired]
  );

  return {
    hours,
    totalAmount,
    showPayment,
    openPayment: () => setShowPayment(true),
    closePayment: () => setShowPayment(false),
  };
};
