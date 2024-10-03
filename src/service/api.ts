import { useAuthStore } from '@/stores/auth'
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse
} from 'axios'

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders
}

// const baseUrl = 'https://api-interview-vue.bayarind.id'
const baseUrl = import.meta.env.VITE_BASE_URL

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config): AdaptAxiosRequestConfig => {
    const authStore = useAuthStore()
    if (authStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    const status = error.response?.status
    const data = error.response?.data as { message?: string }

    if (
      status === 401 ||
      data?.message === 'Authorization Token not found' ||
      data?.message === 'Token is Invalid' ||
      data?.message === 'Token is Expired'
    ) {
      const authStore = useAuthStore()
      authStore.clearUser()
      const path = window.location.pathname
      if (path !== '/auth/login') {
        window.location.assign('/auth/login?redirect=' + path)
      }
    }

    return Promise.reject(data)
  }
)

export default api
