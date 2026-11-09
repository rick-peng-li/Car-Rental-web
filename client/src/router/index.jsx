import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { ProtectedRoute, AdminRoute } from '@/router/guards';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import HomePage from '@/pages/HomePage';
import BookingPage from '@/pages/BookingPage';
import MyBookingsPage from '@/pages/MyBookingsPage';
import AdminCarsPage from '@/pages/admin/AdminCarsPage';
import AddCarPage from '@/pages/admin/AddCarPage';
import EditCarPage from '@/pages/admin/EditCarPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/booking/:carId', element: <BookingPage /> },
          { path: '/my-bookings', element: <MyBookingsPage /> },
          {
            path: '/admin',
            element: <AdminRoute />,
            children: [
              { index: true, element: <AdminCarsPage /> },
              { path: 'add-car', element: <AddCarPage /> },
              { path: 'edit-car/:carId', element: <EditCarPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
