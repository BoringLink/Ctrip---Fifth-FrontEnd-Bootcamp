import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import MerchantLayout from '../pages/merchant/MerchantLayout'
import HotelListPage from '../pages/merchant/HotelListPage'
import HotelFormPage from '../pages/merchant/HotelFormPage'
import HotelDetailPage from '../pages/merchant/HotelDetailPage'
import ReservationsPage from '../pages/merchant/ReservationsPage'
import AdminLayout from '../pages/admin/AdminLayout'
import ReviewListPage from '../pages/admin/ReviewListPage'
import ReviewDetailPage from '../pages/admin/ReviewDetailPage'
import TagsPage from '../pages/admin/TagsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <RequireAuth role="merchant" />,
    children: [
      {
        path: '/merchant',
        element: <MerchantLayout />,
        children: [
          { index: true, element: <Navigate to="hotels" replace /> },
          { path: 'hotels', element: <HotelListPage /> },
          { path: 'hotels/new', element: <HotelFormPage /> },
          { path: 'hotels/:id', element: <HotelDetailPage /> },
          { path: 'hotels/:id/edit', element: <HotelFormPage /> },
          { path: 'reservations', element: <ReservationsPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth role="admin" />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="review" replace /> },
          { path: 'review', element: <ReviewListPage /> },
          { path: 'review/:id', element: <ReviewDetailPage /> },
          { path: 'tags', element: <TagsPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
