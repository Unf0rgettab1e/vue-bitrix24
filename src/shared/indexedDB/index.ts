import { IndexedDBStorage } from '@/shared/indexedDB/storage'

export const db = new IndexedDBStorage({
  dbTitle: 'appDB',
  version: 1,
  stores: [{ name: 'companies', keyPath: 'ID' }],
})
