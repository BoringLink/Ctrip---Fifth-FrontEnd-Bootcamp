import http from './http'
import type { Hotel } from '../types'

export const hotelsApi = {
  create: (data: Partial<Hotel>) =>
    http.post<Hotel>('/hotels', data),

  getMerchantHotels: () =>
    http.get<Hotel[]>('/hotels/merchant'),

  getById: (id: string) =>
    http.get<Hotel>(`/hotels/${id}`),

  update: (id: string, data: Partial<Hotel>) =>
    http.put<Hotel>(`/hotels/${id}`, data),

  remove: (id: string) =>
    http.delete(`/hotels/${id}`),

  // admin
  getPending: () =>
    http.get<Hotel[]>('/hotels/verification'),

  approve: (id: string) =>
    http.put(`/hotels/${id}/approve`),

  reject: (id: string, reason: string) =>
    http.put(`/hotels/${id}/reject`, { rejectionReason: reason }),

  offline: (id: string) =>
    http.put(`/hotels/${id}/offline`),

  online: (id: string) =>
    http.put(`/hotels/${id}/online`),

  // public
  search: (params: Record<string, unknown>) =>
    http.get<Hotel[]>('/hotels', { params }),
}
