import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url && !config.url.startsWith('/api')) {
      config.url = `/api${config.url}`
    }
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export interface Result<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export interface PageParams {
  current?: number
  size?: number
}

export const request = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return instance.get(url, config).then((res) => res.data)
  },

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Result<T>> {
    return instance.post(url, data, config).then((res) => res.data)
  },

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Result<T>> {
    return instance.put(url, data, config).then((res) => res.data)
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return instance.delete(url, config).then((res) => res.data)
  },
}

export default instance
