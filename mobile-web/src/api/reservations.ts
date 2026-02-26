import http from './http'
import type { CreateReservationDto, Reservation } from '../types'

export const reservationsApi = {
  create: (data: CreateReservationDto) =>
    http.post<Reservation>('/reservations', data),

  getById: (id: string) =>
    http.get<Reservation>(`/reservations/${id}`),
}
