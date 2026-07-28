import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import axios from 'axios'

import {
  DEFAULT_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  STORAGE_ACCESS_TOKEN_KEY,
  TIMEOUT_ERROR_MESSAGE,
} from '@/config/const'
import { useConfigStore } from '@/stores'

import { localStorage } from './storage'

export interface ApiResponse<T> {
  data: T
  msg: string
  status: 'error' | 'success'
}

let loadingRequestCount = 0

function createBaseURL(): string {
  const { VITE_API_PREFIX, VITE_API_URL, VITE_ENABLE_MOCK, VITE_MOCK_URL } = import.meta.env
  const origin = VITE_ENABLE_MOCK === 'true' ? VITE_MOCK_URL : VITE_API_URL
  const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin
  const normalizedPrefix = VITE_API_PREFIX.startsWith('/') ? VITE_API_PREFIX : `/${VITE_API_PREFIX}`

  return `${normalizedOrigin}${normalizedPrefix}`
}

function finishLoading(config?: AxiosRequestConfig): void {
  if (config?.loading === false) {
    return
  }

  loadingRequestCount = Math.max(0, loadingRequestCount - 1)
  if (loadingRequestCount === 0) {
    useConfigStore().setLoading({ mask: false, visible: false })
  }
}

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE
  }

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return TIMEOUT_ERROR_MESSAGE
  }

  return error.response?.data?.msg || error.message || NETWORK_ERROR_MESSAGE
}

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'msg' in value &&
    'status' in value
  )
}

function startLoading(config: AxiosRequestConfig): void {
  if (config.loading === false) {
    return
  }

  loadingRequestCount += 1
  useConfigStore().setLoading({ mask: config.mask ?? true, visible: true })
}

function unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  if (!isApiResponse<T>(response.data)) {
    return response.data as T
  }

  if (response.data.status === 'error') {
    throw new Error(response.data.msg || DEFAULT_ERROR_MESSAGE)
  }

  return response.data.data
}

export const instance = axios.create({
  baseURL: createBaseURL(),
  timeout: 20000,
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    startLoading(config)

    const token = localStorage.get<string>(STORAGE_ACCESS_TOKEN_KEY)
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    finishLoading(response.config)
    return response
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      finishLoading(error.config)
    }

    return Promise.reject(new Error(getErrorMessage(error)))
  },
)

function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return instance.get<ApiResponse<T>>(url, config).then(unwrapResponse)
}

function patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
  return instance.patch<ApiResponse<T>>(url, data, config).then(unwrapResponse)
}

function post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
  return instance.post<ApiResponse<T>>(url, data, config).then(unwrapResponse)
}

function put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
  return instance.put<ApiResponse<T>>(url, data, config).then(unwrapResponse)
}

function remove<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return instance.delete<ApiResponse<T>>(url, config).then(unwrapResponse)
}

function request<T, D = unknown>(config: AxiosRequestConfig<D>): Promise<T> {
  return instance.request<ApiResponse<T>>(config).then(unwrapResponse)
}

const service = {
  delete: remove,
  get,
  patch,
  post,
  put,
  request,
}

export default service
