export type InvoiceItem = {
  description: string
  quantity: number
  unitPrice: number
  total: number
  details?: string
}

export type InvoiceStatus = 'PAID' | 'OVERDUE' | 'DRAFT' | 'SENT' | 'VIEWED' | 'PENDING'

export type Invoice = {
  id: number
  number: string
  reference: string
  dueDate: string
  amount: number
  status: InvoiceStatus
  clientName: string
  clientPhone: string
  clientEmail: string
  issueDate: string
  currency: string
  createdAt: string
  items: InvoiceItem[]
  discountRate?: number
}
