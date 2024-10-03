import api from '@/service/api'
import { defineStore } from 'pinia'
import { type JobPosition } from '@/types'

export const useJobPositionStore = defineStore('jobPosition', {
  state: () => ({
    jobPositions: <JobPosition[]>[]
  }),
  actions: {
    async getJobPositions() {
      try {
        const res = await api.get('api/position/list')
        this.jobPositions = res.data.data
      } catch (err) {
        console.log(err)
      }
    }
  }
})
