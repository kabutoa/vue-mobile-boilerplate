import request from '@/utils/request'

interface IUserInfo {
  created_at: string
  email: string
  id: number
  name: string
  permissions: string[]
  role: string
  updated_at: string
}

export const getUserInfo = () =>
  request<IUserInfo>({
    mask: false,
    method: 'get',
    url: '/me',
  })
