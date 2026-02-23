import http from './http'

export const hotelsApi = {
  search: (params: { keyword?: string; starRating?: number; page?: number; pageSize?: number }) =>
    http.get('/api/hotels', { params }),

  getById: (id: string) => http.get(`/api/hotels/${id}`),

  getTags: () => http.get('/api/tags'),
}
