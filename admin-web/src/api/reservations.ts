import http from './http'
import type { Reservation } from '../types'

export const reservationsApi = {
  create: (data: Partial<Reservation>) =>
    http.post<Reservation>('/reservations', data),

  getAll: () =>
    http.get<Reservation[]>('/reservations'),

  getById: (id: string) =>
    http.get<Reservation>(`/reservations/${id}`),

  getByHotel: (hotelId: string) =>
    http.get<Reservation[]>(`/reservations/hotel/${hotelId}`),

  checkIn: (id: string) =>
    http.put(`/reservations/${id}/check-in`),

  checkOut: (id: string) =>
    http.put(`/reservations/${id}/check-out`),

  cancel: (id: string) =>
    http.put(`/reservations/${id}/cancel`),
}
