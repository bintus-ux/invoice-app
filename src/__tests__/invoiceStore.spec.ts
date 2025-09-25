import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInvoiceStore } from '@/stores/invoiceStore'
import type { Invoice } from '@/types/invoice'

describe('invoiceStore', () => {
  let store: ReturnType<typeof useInvoiceStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useInvoiceStore()

    // disable async loadInvoices side effect
    store.loadInvoices = vi.fn()
    store.invoices = []
  })

  const makeInvoice = (overrides: Partial<Invoice> = {}): Invoice => ({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    number: 'INV-1',
    reference: 'REF-1',
    dueDate: '2025-10-01',
    amount: 100,
    status: 'DRAFT',
    clientName: 'Test Client',
    clientPhone: '123',
    clientEmail: 'test@example.com',
    issueDate: '2025-09-01',
    currency: 'USD',
    items: [],
    ...overrides,
  })

  it('starts with empty invoices and correct defaults', () => {
    expect(store.invoices).toEqual([])
    expect(store.selectedInvoice).toBeNull()
    expect(store.isModalOpen).toEqual(false)
    expect(store.isLoading).toEqual(true)
  })

  it('setInvoices replaces invoice list', () => {
    const invoice = makeInvoice({ id: 1 })
    store.setInvoices([invoice])

    expect(store.invoices).toHaveLength(1)
    expect(store.invoices[0].id).toEqual(1)
  })

  it('addInvoice creates and prepends new invoice', () => {
    const invoice = store.addInvoice({
      number: 'INV-2',
      reference: 'REF-2',
      dueDate: '2025-10-10',
      amount: 200,
      status: 'PAID',
      clientName: 'Client 2',
      clientPhone: '555',
      clientEmail: 'c2@example.com',
      issueDate: '2025-09-05',
      currency: 'USD',
      items: [],
    })

    expect(store.invoices[0]).toEqual(invoice)
    expect(invoice.id).toBeDefined()
    expect(invoice.createdAt).toBeDefined()
  })

  it('pushInvoice prepends an invoice', () => {
    const invoice = makeInvoice({ id: 2 })
    store.pushInvoice(invoice)

    expect(store.invoices[0]).toEqual(invoice)
  })

  it('recentInvoices returns 5 most recent sorted by createdAt', () => {
    const now = Date.now()
    for (let i = 0; i < 6; i++) {
      store.pushInvoice(
        makeInvoice({
          id: i,
          createdAt: new Date(now - i * 1000).toISOString(),
        }),
      )
    }

    expect(store.recentInvoices).toHaveLength(5)
    const ids = store.recentInvoices.map((inv) => inv.id)
    // should be most recent 5 ids: 0..4
    expect(ids).not.toContain(5)
  })

  it('totalStats calculates correctly', () => {
    store.setInvoices([
      makeInvoice({ amount: 100, status: 'PAID' }),
      makeInvoice({ amount: 50, status: 'OVERDUE' }),
      makeInvoice({ amount: 30, status: 'DRAFT' }),
      makeInvoice({ amount: 20, status: 'SENT' }),
    ])

    expect(store.totalStats.totalPaid).toEqual(100)
    expect(store.totalStats.totalOverdue).toEqual(50)
    expect(store.totalStats.totalDraft).toEqual(30)
    expect(store.totalStats.totalUnpaid).toEqual(20)
  })

  it('openInvoiceModal sets selectedInvoice and opens modal', () => {
    const invoice = makeInvoice({ id: 99 })
    store.openInvoiceModal(invoice)

    expect(store.selectedInvoice).toEqual(invoice)
    expect(store.isModalOpen).toEqual(true)
  })

  it('closeInvoiceModal clears selectedInvoice and closes modal', () => {
    const invoice = makeInvoice({ id: 101 })
    store.openInvoiceModal(invoice)
    store.closeInvoiceModal()

    expect(store.selectedInvoice).toBeNull()
    expect(store.isModalOpen).toEqual(false)
  })

  it('updateInvoiceStatus updates an invoice status', () => {
    const invoice = makeInvoice({ id: 202, status: 'DRAFT' })
    store.pushInvoice(invoice)

    store.updateInvoiceStatus(202, 'PAID')
    expect(store.invoices[0].status).toEqual('PAID')
  })
})
