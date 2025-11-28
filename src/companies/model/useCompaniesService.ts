import type { CompanyChunkResponse } from './types'
import { useCompaniesStore } from './companies.store'
export function useCompaniesService() {
  const store = useCompaniesStore()

  // &filter[ACTIVE]=Y&select[]=ID&select[]=TITLE
  async function fetchCompaniesChunk(start: number): Promise<CompanyChunkResponse> {
    const url = `${import.meta.env.VITE_BITRIX_WEBHOOK_URL}/crm.company.list?start=${start}&order[ID]=ASC`
    const response = await fetch(url)
    const data = await response.json()
    const items = data.result || []
    const total = data.total || 10000
    const next = data.next || null

    return { total, next, items }
  }

  async function loadAllCompanies() {
    store.startLoading()

    let next: number | null = 0
    while (next !== null && next < 201) {
      const chunk = await fetchCompaniesChunk(next)
      if (store.total === 0) store.setTotal(chunk.total)
      store.addCompanies(chunk.items)
      next = chunk.next
    }

    store.finishLoading()
  }

  return { loadAllCompanies }
}
