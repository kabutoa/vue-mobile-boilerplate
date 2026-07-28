import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    dedupe?: boolean
    loading?: boolean
    mask?: boolean
  }
}
