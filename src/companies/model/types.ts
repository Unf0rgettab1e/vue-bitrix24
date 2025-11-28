export interface Company {
  ID: string
  TITLE: string
  INDUSTRY?: string
  COMPANY_TYPE?: string
  LAST_ACTIVITY_TIME?: string
}

export interface CompanyChunkResponse {
  total: number
  next: number | null
  items: Company[]
}
