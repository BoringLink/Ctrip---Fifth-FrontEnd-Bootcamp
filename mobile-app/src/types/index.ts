export interface HotelTag {
  id: string
  name: string
}

export interface HotelRoom {
  id: string
  name: string
  price: number
  capacity: number
  quantity: number
  description?: string
}

export interface HotelFacility {
  id: string
  name: string
  category?: string
}

export interface HotelImage {
  id: string
  url: string
  isMain: boolean
}

export interface Hotel {
  id: string
  nameZh: string
  nameEn: string
  address: string
  starRating: number
  description?: string
  rooms: HotelRoom[]
  facilities: HotelFacility[]
  images: HotelImage[]
  tags: { tag: HotelTag }[]
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
  status: 'confirmed' | 'check_in' | 'check_out' | 'cancelled'
  totalPrice: number
  hotel: Hotel
  room: HotelRoom
}

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  Home: undefined
  Search: { keyword?: string; tagId?: string; starRating?: number }
  HotelDetail: { id: string }
  Booking: { hotelId: string; roomId: string; roomName: string; price: number }
  Confirm: { reservationId: string }
}
