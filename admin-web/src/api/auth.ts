import http from './http'
import type { User } from '../types'

export const authApi = {
  register: (data: { email: string; password: string; name: string; role: 'merchant' | 'admin' }) =>
    http.post<{ user: User; token: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    http.post<{ user: User; token: string }>('/auth/login', data),

  profile: () => http.get<User>('/auth/profile'),
}
