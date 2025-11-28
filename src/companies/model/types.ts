export interface Company {
  ID: string
  TITLE: string
  COMPANY_TYPE?: string
}

export interface CompanyChunkResponse {
  total: number
  next: number | null
  items: Company[]
}
