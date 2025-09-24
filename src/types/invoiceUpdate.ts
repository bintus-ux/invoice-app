import type { InvoiceStatus } from '@/types/invoice'

export interface InvoiceUpdateData {
  id: number
  status: InvoiceStatus
  updatedAt: string
  message?: string
}
