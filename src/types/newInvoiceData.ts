import type { InvoiceStatus } from '@/types/invoice'

export interface NewInvoiceData {
  id: number
  number: string
  status: InvoiceStatus
  amount: number
  clientName: string
  createdAt: string
}
