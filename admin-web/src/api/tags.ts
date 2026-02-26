import http from './http'
import type { HotelTag } from '../types'

export const tagsApi = {
  getAll: () => http.get<HotelTag[]>('/tags'),
  create: (data: { name: string; description?: string }) =>
    http.post<HotelTag>('/tags', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    http.put<HotelTag>(`/tags/${id}`, data),
  remove: (id: string) => http.delete(`/tags/${id}`),
  associate: (tagId: string, hotelId: string) =>
    http.post(`/tags/${tagId}/hotels/${hotelId}`),
  disassociate: (tagId: string, hotelId: string) =>
    http.delete(`/tags/${tagId}/hotels/${hotelId}`),
}
