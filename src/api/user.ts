import service from '@/utils/request'

export const getUserInfo = () => service.get('/me', { loading: false })
