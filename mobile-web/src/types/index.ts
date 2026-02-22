export type HotelStatus = 'pending' | 'approved' | 'rejected' | 'offline'
export type ReservationStatus = 'confirmed' | 'check_in' | 'check_out' | 'cancelled'
export type IdType = 'id_card' | 'passport' | 'other'
export type DiscountType = 'percentage' | 'fixed' | 'package'

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
  name: string
  category?: string
}

export interface HotelImage {
  id: string
  url: string
  caption?: string
  isPrimary: boolean
}

export interface HotelPromotion {
  id: string
  title: string
  description?: string
  discountType: DiscountType
  discountValue: number
  startDate: string
  endDate: string
}

export interface HotelNearbyAttraction {
  id: string
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
  rooms?: HotelRoom[]
  facilities?: HotelFacility[]
  images?: HotelImage[]
  promotions?: HotelPromotion[]
  nearbyAttractions?: HotelNearbyAttraction[]
  tags?: { tag: HotelTag }[]
}

export interface Guest {
  name: string
  phone: string
  idType: IdType
  idNumber: string
}

export interface CreateReservationDto {
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  guestName: string
  guestPhone: string
  guestEmail: string
  totalPrice: number
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
}
