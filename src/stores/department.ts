import api from '@/service/api'
import { defineStore } from 'pinia'
import { type Department } from '@/types'

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    departments: <Department[]>[]
  }),
  actions: {
    async getDepartments() {
      try {
        const res = await api.get('api/departement/list')
        this.departments = res.data.data
      } catch (err) {
        console.log(err)
      }
    }
  }
})
