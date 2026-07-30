import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    loading?: boolean
    mask?: boolean
  }
}
