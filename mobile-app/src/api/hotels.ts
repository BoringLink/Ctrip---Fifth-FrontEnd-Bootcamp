import http from './http'

export const hotelsApi = {
  search: (params: { keyword?: string; starRating?: number; page?: number; pageSize?: number; limit?: number }) =>
    http.get('/api/hotels', { params: { ...params, limit: params.limit ?? params.pageSize } }),

  getById: (id: string) => http.get(`/api/hotels/${id}`),

  getTags: () => http.get('/api/tags'),
}
