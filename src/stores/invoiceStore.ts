import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dummyInvoices } from '@/composables/dummyInvoices'
import type { Invoice } from '@/types/invoice'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref<Invoice[]>([])
  const selectedInvoice = ref<Invoice | null>(null)
  const isModalOpen = ref(false)
  const isLoading = ref(false)

  const recentInvoices = computed(() => {
    return [...invoices.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  })

  const totalStats = computed(() => {
    return invoices.value.reduce(
      (stats, invoice) => {
        if (invoice.status === 'PAID') stats.totalPaid += invoice.amount
        if (invoice.status === 'OVERDUE') stats.totalOverdue += invoice.amount
        if (invoice.status === 'DRAFT') stats.totalDraft += invoice.amount
        if (['SENT', 'VIEWED', 'PENDING'].includes(invoice.status))
          stats.totalUnpaid += invoice.amount
        return stats
      },
      {
        totalPaid: 0,
        totalOverdue: 0,
        totalDraft: 0,
        totalUnpaid: 0,
      },
    )
  })

  const loadInvoices = async () => {
    isLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      invoices.value = dummyInvoices
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      isLoading.value = false
    }
  }

  const setInvoices = (newInvoices: Invoice[]) => {
    invoices.value = newInvoices
  }

  const addInvoice = (newInvoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const invoice: Invoice = {
      ...newInvoice,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    } as Invoice

    invoices.value.unshift(invoice)
    return invoice
  }

  const pushInvoice = (invoice: Invoice) => {
    invoices.value.unshift(invoice)
  }

  const openInvoiceModal = (invoice: Invoice) => {
    selectedInvoice.value = invoice
    isModalOpen.value = true
  }

  const closeInvoiceModal = () => {
    selectedInvoice.value = null
    isModalOpen.value = false
  }

  const updateInvoiceStatus = (invoiceId: number, status: Invoice['status']) => {
    const invoice = invoices.value.find((inv) => inv.id === invoiceId)
    if (invoice) {
      invoice.status = status
    }
  }

  loadInvoices()

  return {
    invoices,
    selectedInvoice,
    isModalOpen,
    isLoading,

    recentInvoices,
    totalStats,

    loadInvoices,
    setInvoices,
    addInvoice,
    pushInvoice,
    openInvoiceModal,
    closeInvoiceModal,
    updateInvoiceStatus,
  }
})
