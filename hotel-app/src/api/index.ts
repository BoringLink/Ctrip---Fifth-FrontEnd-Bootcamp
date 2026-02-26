// Android 模拟器访问本机用 10.0.2.2，真机改成局域网 IP
const BASE_URL = 'http://10.0.2.2:3000'

function request<T>(options: UniApp.RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url: BASE_URL + options.url,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else {
          reject(res)
        }
      },
      fail: reject,
    })
  })
}

export const hotelsApi = {
  search: (params: { keyword?: string; starRating?: number; page?: number; pageSize?: number }) =>
    request<any>({ url: '/api/hotels', method: 'GET', data: params }),

  getById: (id: string) =>
    request<any>({ url: `/api/hotels/${id}`, method: 'GET' }),

  getTags: () =>
    request<any[]>({ url: '/api/tags', method: 'GET' }),
}

export const reservationsApi = {
  create: (data: object) =>
    request<any>({ url: '/api/reservations', method: 'POST', data }),

  getById: (id: string) =>
    request<any>({ url: `/api/reservations/${id}`, method: 'GET' }),
}
