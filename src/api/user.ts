import service from '@/utils/request'

interface IUserInfo {
  created_at: string
  email: string
  id: number
  name: string
  permissions: string[]
  role: string
  updated_at: string
}

export const getUserInfo = () => service.get<IUserInfo>('/me', { loading: false })
