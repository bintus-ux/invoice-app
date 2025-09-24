import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dummyInvoices } from '@/composables/dummyInvoices'
import type { Invoice } from '@/types/invoice'

export const useInvoiceStore = defineStore('invoice', () => {
  // State
  const invoices = ref<Invoice[]>([])
  const selectedInvoice = ref<Invoice | null>(null)
  const isModalOpen = ref(false)
  const isLoading = ref(false)

  // Getters
  const recentInvoices = computed(() => {
    // Always sort newest → oldest by createdAt
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

  // Actions
  const loadInvoices = async () => {
    isLoading.value = true
    try {
      // Simulate API call delay
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

  // For invoices created locally (e.g., via modal form)
  const addInvoice = (newInvoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const invoice: Invoice = {
      ...newInvoice,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    } as Invoice

    invoices.value.unshift(invoice)
    return invoice
  }

  // ✅ For invoices received from socket (already has id + createdAt)
  const pushInvoice = (invoice: Invoice) => {
    invoices.value.unshift(invoice)
  }

  const openInvoiceModal = (invoice: Invoice) => {
    console.log('🔄 Opening modal for invoice:', invoice.id)
    selectedInvoice.value = invoice
    isModalOpen.value = true
    console.log('✅ Modal state updated - selectedInvoice:', selectedInvoice.value)
    console.log('✅ Modal state updated - isModalOpen:', isModalOpen.value)
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

  // Initialize with dummy data
  loadInvoices()

  return {
    // State
    invoices,
    selectedInvoice,
    isModalOpen,
    isLoading,

    // Getters
    recentInvoices,
    totalStats,

    // Actions
    loadInvoices,
    setInvoices,
    addInvoice,
    pushInvoice,
    openInvoiceModal,
    closeInvoiceModal,
    updateInvoiceStatus,
  }
})
