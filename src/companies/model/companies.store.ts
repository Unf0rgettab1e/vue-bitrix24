import { defineStore } from 'pinia'
import type { Company } from './types'

interface State {
  companies: Company[]
  isLoading: boolean
  progress: number
  total: number
}

export const useCompaniesStore = defineStore('companies', {
  state: (): State => ({ companies: [], isLoading: false, progress: 0, total: 0 }),
  actions: {
    setTotal(total: number) {
      this.total = total
    },
    addCompanies(chunk: Company[]) {
      this.companies = [...this.companies, ...chunk]
      this.progress = Math.min(100, (this.companies.length / this.total) * 100)
    },
    startLoading() {
      this.isLoading = true
      this.companies = []
      this.progress = 0
    },
    finishLoading() {
      this.isLoading = false
      this.progress = 100
    },
  },
})
