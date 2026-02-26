import http from './http'

export const reservationsApi = {
  create: (data: {
    hotelId: string
    roomId: string
    checkInDate: string
    checkOutDate: string
    guestName: string
    guestPhone: string
    guestEmail: string
    totalPrice: number
  }) => http.post('/api/reservations', data),

  getById: (id: string) => http.get(`/api/reservations/${id}`),
}
