import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '@/store/slices/carsSlice';

/**
 * Load the car list once and keep it in sync with the store.
 */
export const useCars = () => {
  const dispatch = useDispatch();
  const { cars, status, error, mutationLoading } = useSelector((state) => state.cars);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCars());
    }
  }, [dispatch, status]);

  return { cars, status, error, mutationLoading, refetch: () => dispatch(fetchCars()) };
};
