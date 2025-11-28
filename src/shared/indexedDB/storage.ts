export interface IDBStoreConfig {
  name: string
  keyPath: string | string[]
}

interface IDBConfig {
  dbTitle: string
  version: number
  stores: IDBStoreConfig[]
}

export class IndexedDBStorage {
  private dbTitle: string
  private version: number
  private stores: IDBStoreConfig[]
  private db: IDBDatabase | null = null

  constructor(config: IDBConfig) {
    this.dbTitle = config.dbTitle
    this.version = config.version
    this.stores = config.stores
  }

  private open(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db)

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbTitle, this.version)

      request.onupgradeneeded = () => {
        const db = request.result

        this.stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, { keyPath: store.keyPath })
          }
        })
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onerror = () => reject(request.error)
    })
  }

  async put<T>(storeName: string, value: T): Promise<void> {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      tx.objectStore(storeName).put(value)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async bulkPut<T>(storeName: string, values: T[]): Promise<void> {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      values.forEach((v) => store.put(v))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly')
      const request = tx.objectStore(storeName).getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      tx.objectStore(storeName).clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}
