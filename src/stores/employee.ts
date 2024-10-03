import api from '@/service/api'
import { defineStore } from 'pinia'
import { type Employee, type PayloadEmployee } from '@/types'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: <Employee[]>[],
    meta: {
      total: 0,
      totalPage: 0
    }
  }),
  getters: {},
  actions: {
    async getEmployees(page: number, limit: number, search: string) {
      const res = await api.get(`api/employee?page=${page + 1}&limit=${limit}&search=${search}`)
      this.employees = res.data.data.list
      this.meta.total = res.data.data.total
      this.meta.totalPage = res.data.data.total_page
    },
    async addEmployee(payload: PayloadEmployee) {
      try {
        const res = await api.post('api/employee', payload)
        return res
      } catch (err) {
        return err
      }
    },
    async updateEmployee(payload: PayloadEmployee) {
      try {
        const res = await api.put('api/employee', payload)
        return res
      } catch (err) {
        return err
      }
    },
    async deleteEmployee(id: number) {
      try {
        const res = await api.delete('api/employee', { data: { id: id } })
        return res
      } catch (err) {
        return err
      }
    }
  }
})
