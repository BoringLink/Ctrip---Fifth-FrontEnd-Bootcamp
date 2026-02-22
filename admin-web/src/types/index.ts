export type UserRole = 'merchant' | 'admin'
export type HotelStatus = 'pending' | 'approved' | 'rejected' | 'offline'
export type ReservationStatus = 'confirmed' | 'check_in' | 'check_out' | 'cancelled'
export type IdType = 'id_card' | 'passport' | 'other'
export type DiscountType = 'percentage' | 'fixed' | 'package'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface HotelTag {
  id: string
  name: string
  description?: string
}

export interface HotelRoom {
  id: string
  hotelId: string
  name: string
  description?: string
  price: number
  capacity: number
  quantity: number
}

export interface HotelFacility {
  id: string
  hotelId: string
  name: string
  category?: string
}

export interface HotelImage {
  id: string
  hotelId: string
  url: string
  caption?: string
  isPrimary: boolean
}

export interface HotelPromotion {
  id: string
  hotelId: string
  title: string
  description?: string
  discountType: DiscountType
  discountValue: number
  startDate: string
  endDate: string
}

export interface HotelNearbyAttraction {
  id: string
  hotelId: string
  name: string
  distance: number
  type?: string
}

export interface Hotel {
  id: string
  nameZh: string
  nameEn: string
  address: string
  starRating: number
  openingDate: string
  description?: string
  status: HotelStatus
  rejectionReason?: string
  merchantId: string
  createdAt: string
  updatedAt: string
  rooms?: HotelRoom[]
  facilities?: HotelFacility[]
  images?: HotelImage[]
  promotions?: HotelPromotion[]
  nearbyAttractions?: HotelNearbyAttraction[]
  tags?: { tag: HotelTag }[]
}

export interface Guest {
  id: string
  name: string
  phone: string
  idType: IdType
  idNumber: string
}

export interface Reservation {
  id: string
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  guestName: string
  guestPhone: string
  guestEmail: string
  status: ReservationStatus
  totalPrice: number
  createdAt: string
  hotel?: Hotel
  room?: HotelRoom
  guests?: Guest[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
