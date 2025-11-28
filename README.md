# README — Vue 3 + TypeScript Bitrix Webhook Demo

## Overview

This project is a demo application for **Vue 3 + TypeScript + Pinia**, demonstrating how to work with Bitrix24 webhooks to download a list of companies. The project uses a modular architecture with separate Domain, Data, and UI layers and front-end data caching via **pure IndexedDB**. Both synchronous and asynchronous requests are implemented.

### Архитектура

- **Feature Modules**: each business feature has its own domain (`companies`).
- **Composable Services**: the service for working with webhooks (`useCompaniesService.ts`) encapsulates the download logic, progress, and cache via IndexedDB.
- **Store Isolation**: Pinia store for every feature.
- **Front-end caching**: company data is cached in IndexedDB for fast loading without repeated requests.
- **TypeScript**: all components, services, and stores use TypeScript.

## REST API Bitrix24 service with IndexedDB

В `useCompaniesService.ts`:

```ts
function getNextChunks(total: number, chunkSize = 50) {
  const numberOfChunks = Math.ceil(total / chunkSize)
  const chunks = []

  for (let chunkIndex = 1; chunkIndex < numberOfChunks; chunkIndex++) {
    chunks.push(chunkIndex * chunkSize)
  }

  return chunks
}

async function fetchInBatches(requests: (() => Promise<CompanyChunkResponse>)[], batchSize = 5) {
  const results = []
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize).map((r) => r())
    const res = await Promise.all(batch)
    results.push(...res)
  }
  return results
}

export function useCompaniesService() {
  const store = useCompaniesStore()

  async function saveCompaniesToDB(companies: Company[]) {
    await db.bulkPut<Company>('companies', companies)
  }

  async function loadCachedCompaniesFromDB(): Promise<number> {
    const startTime = performance.now()
    const cached = await db.getAll<Company>('companies')
    if (cached.length > 0) {
      store.setTotal(cached.length)
      store.addCompanies(cached)
      store.finishLoading()
      const endTime = performance.now()
      store.timeRequest = Math.round(endTime - startTime)
    }

    return cached.length
  }

  async function loadAllCompaniesWrapper(callback: () => Promise<void>) {
    store.startLoading()
    const startTime = performance.now()

    const cachedLength = await loadCachedCompaniesFromDB()
    if (cachedLength) return

    await callback()

    store.finishLoading()
    const endTime = performance.now()
    store.timeRequest = Math.round(endTime - startTime)
  }

  async function fetchCompaniesChunk(start: number): Promise<CompanyChunkResponse> {
    const url = `${import.meta.env.VITE_BITRIX_WEBHOOK_URL}/crm.company.list?start=${start}&order[ID]=ASC`
    const response = await fetch(url)
    const data = await response.json()
    const items = data.result || []
    const total = data.total || 10000
    const next = data.next || null

    store.addCompanies(items)
    saveCompaniesToDB(items)

    return { total, next, items }
  }

  const loadAllCompaniesSync = () =>
    loadAllCompaniesWrapper(async () => {
      let next: number | null = 0
      while (next !== null) {
        const chunk = await fetchCompaniesChunk(next)
        if (store.total === 0) store.setTotal(chunk.total)
        next = chunk.next
      }
    })

  const loadAllCompaniesAsync = () =>
    loadAllCompaniesWrapper(async () => {
      const first = await fetchCompaniesChunk(0)
      if (store.total === 0) store.setTotal(first.total)

      await fetchInBatches([
        ...getNextChunks(first.total).map((start) => () => fetchCompaniesChunk(start)),
      ])
    })

  async function clearCompanies(withDB = true) {
    if (withDB) {
      await db.clear('companies')
    }
    store.clearCompanies()
  }

  return { loadAllCompaniesSync, loadAllCompaniesAsync, clearCompanies }
}
```

## Install and Run

1. Clone the repo.
2. Install dependencies:

```bash
npm install
```

3. Run the local server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173)
