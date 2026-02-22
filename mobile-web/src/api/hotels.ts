import http from './http'
import type { Hotel } from '../types'

export const hotelsApi = {
  search: async (params: Record<string, unknown>) => {
    const res = await http.get<{ hotels: Hotel[] } | Hotel[]>('/hotels', { params })
    const data = res.data
    return { data: Array.isArray(data) ? data : (data as any).hotels as Hotel[] }
  },

  getById: (id: string) =>
    http.get<Hotel>(`/hotels/${id}`),

  getTags: () =>
    http.get('/tags'),
}
