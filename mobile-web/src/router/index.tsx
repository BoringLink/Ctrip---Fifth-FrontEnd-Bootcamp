import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from '../pages/home/HomePage'
import SearchPage from '../pages/search/SearchPage'
import HotelDetailPage from '../pages/hotel/HotelDetailPage'
import BookingPage from '../pages/booking/BookingPage'
import ConfirmPage from '../pages/booking/ConfirmPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/hotel/:id', element: <HotelDetailPage /> },
  { path: '/booking/:hotelId/:roomId', element: <BookingPage /> },
  { path: '/booking/confirm/:reservationId', element: <ConfirmPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
