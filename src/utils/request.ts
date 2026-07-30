import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import axios from 'axios'

import { DEFAULT_ERROR_MESSAGE, STORAGE_ACCESS_TOKEN_KEY } from '@/config/const'
import { useConfigStore } from '@/stores'

import { localStorage } from './storage'

export interface ApiResponse<T> {
  data: T
  msg: string
  status: 'error' | 'success'
}

function createBaseURL(): string {
  const { VITE_API_PREFIX, VITE_API_URL, VITE_ENABLE_MOCK, VITE_MOCK_URL } = import.meta.env
  const origin = VITE_ENABLE_MOCK === 'true' ? VITE_MOCK_URL : VITE_API_URL
  const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin
  const normalizedPrefix = VITE_API_PREFIX.startsWith('/') ? VITE_API_PREFIX : `/${VITE_API_PREFIX}`

  return `${normalizedOrigin}${normalizedPrefix}`
}

let loadingRequestCount = 0

function startLoading(config: AxiosRequestConfig): void {
  // 若配置了 loading 为 false，则不显示加载中
  if (config.loading === false) {
    return
  }

  loadingRequestCount += 1
  useConfigStore().setLoading({ mask: config.mask ?? true, visible: true })
}

function stopLoading(config?: AxiosRequestConfig): void {
  // 若配置了 loading 为 false，则不隐藏加载中
  if (config?.loading === false) {
    return
  }

  loadingRequestCount = Math.max(0, loadingRequestCount - 1)
  if (loadingRequestCount === 0) {
    useConfigStore().setLoading({ mask: false, visible: false })
  }
}

const instance = axios.create({
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
  <T>(response: AxiosResponse<ApiResponse<T>>) => {
    stopLoading(response.config)
    const res = response.data
    const { msg, status } = res
    if (status === 'error') {
      // console.log(msg)
      return Promise.reject(msg)
    }
    return res.data
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      stopLoading(error.config)
    }
    return Promise.reject(error || DEFAULT_ERROR_MESSAGE)
  },
)

const request = <T>(config: AxiosRequestConfig): Promise<T> => {
  if (config.method === 'get') {
    config.params = config.data
  }
  return instance(config)
}

export default request
