import api from '@/service/api'
import { defineStore } from 'pinia'
import { type UserData } from '@/types'

export const useAuthStore = defineStore('authBayarind', {
  state: () => ({
    user: null as UserData | null,
    token: '' as string
  }),
  getters: {
    isAuthenticated(): boolean {
      return this.token !== ''
    }
  },
  actions: {
    clearUser() {
      this.user = null
      this.token = ''
    },
    async login(email: string, password: string) {
      const res = await api.post(`api/auth/login`, {
        email,
        password
      })

      this.token = res.data.data.token
      this.user = res.data.data.user_data
      return res
    },
    async logout() {
      await api.post('api/auth/logout')
      this.clearUser()
    }
  },
  persist: true
})
