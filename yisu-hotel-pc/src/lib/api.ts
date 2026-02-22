import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 认证
export const login = (credentials: { email: string; password: string }) =>
  api.post('/api/auth/login', credentials).then(res => res.data);

export const register = (data: { email: string; password: string; name: string }) =>
  api.post('/api/auth/register', data).then(res => res.data);

// 酒店（商户）
export const getMyHotels = () => api.get('/api/hotels/merchant').then(res => res.data);
export const createHotel = (data: any) => api.post('/api/hotels', data).then(res => res.data);
export const getHotel = (id: string) => api.get(`/api/hotels/${id}`).then(res => res.data);
export const updateHotel = (id: string, data: any) => api.put(`/api/hotels/${id}`, data).then(res => res.data);
export const deleteHotel = (id: string) => api.delete(`/api/hotels/${id}`).then(res => res.data);
export const uploadHotelImage = (hotelId: string, formData: FormData) =>
  api.post(`/api/hotels/${hotelId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
export const updateHotelImage = (hotelId: string, imageId: string, data: { description?: string; isMain?: boolean }) =>
  api.put(`/api/hotels/${hotelId}/images/${imageId}`, data).then(res => res.data);

export const deleteHotelImage = (hotelId: string, imageId: string) =>
  api.delete(`/api/hotels/${hotelId}/images/${imageId}`).then(res => res.data);
// lib/api.ts
export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};
export const getTags = () => api.get('/tags').then(res => res.data);

// 审核（管理员）
export const getAllHotels = (params?: any) => api.get('/api/admin/hotels', { params }).then(res => res.data);
export const getPendingHotels = () => api.get('/api/admin/hotels/pending').then(res => res.data);
export const approveHotel = (id: string) => api.post(`/api/admin/hotels/${id}/approve`);
export const rejectHotel = (id: string, reason: string) => api.post(`/api/admin/hotels/${id}/reject`, { reason });
export const offlineHotel = (id: string) => api.post(`/api/admin/hotels/${id}/offline`);
export const onlineHotel = (id: string) => api.post(`/api/admin/hotels/${id}/online`);