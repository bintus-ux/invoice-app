<template>
  <div class="w-full bg-white rounded-2xl p-4">
    <div class="h-[350px] overflow-y-auto no-scrollbar p-2">
      <div class="flex justify-between items-center">
        <h1 class="text-xl text-black font-medium">Recent Invoices</h1>
        <button
          @click="navigateToInvoices"
          class="text-xs text-blue hover:bg-blue hover:text-white bg-white py-2 px-6 rounded-full font-medium border border-grey"
        >
          View all invoices
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="recentInvoices.length === 0"
        class="flex justify-center items-center h-40 text-gray-500"
      >
        No invoices found
      </div>

      <!-- Grouped Invoices by Date -->
      <div v-else>
        <div v-for="(group, date) in groupedInvoices" :key="date" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-3">{{ date }}</h3>

          <div
            v-for="invoice in group"
            :key="invoice.id"
            @click="openInvoiceDetails(invoice)"
            class="invoice-item p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-medium text-gray-900">Invoice - {{ invoice.number }}</h4>
                <p class="text-xs text-gray-500">{{ invoice.reference }}</p>
              </div>
              <span class="text-sm font-medium" :class="getStatusColor(invoice.status)">
                {{ formatCurrency(invoice.amount) }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">DUE DATE</span>
              <span class="text-xs text-gray-600">{{ formatDate(invoice.dueDate) }}</span>
            </div>

            <div class="mt-2">
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="getStatusBadgeClass(invoice.status)"
              >
                {{ invoice.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoiceStore } from '@/stores/invoiceStore'

const router = useRouter()
const invoiceStore = useInvoiceStore()

// Get data from store
const recentInvoices = computed(() => invoiceStore.recentInvoices)
const isLoading = computed(() => invoiceStore.isLoading)

// Group invoices by date
const groupedInvoices = computed(() => {
  const groups: Record<string, any[]> = {}

  recentInvoices.value.forEach((invoice) => {
    // Use actual dates from invoices for grouping
    const invoiceDate = new Date(invoice.createdAt || invoice.dueDate)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let groupDate: string

    if (invoiceDate.toDateString() === today.toDateString()) {
      groupDate = 'TODAY'
    } else if (invoiceDate.toDateString() === yesterday.toDateString()) {
      groupDate = 'YESTERDAY'
    } else {
      groupDate = invoiceDate
        .toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        .toUpperCase()
    }

    if (!groups[groupDate]) {
      groups[groupDate] = []
    }
    groups[groupDate].push(invoice)
  })

  return groups
})

// Navigation
const navigateToInvoices = () => {
  router.push('/invoices')
}

// Open invoice details modal using store
const openInvoiceDetails = (invoice: any) => {
  invoiceStore.openInvoiceModal(invoice)
}

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    PAID: 'text-green-600',
    OVERDUE: 'text-red-600',
    DRAFT: 'text-gray-600',
    SENT: 'text-blue-600',
    VIEWED: 'text-purple-600',
    PENDING: 'text-yellow-600',
  }
  return statusColors[status] || 'text-gray-600'
}

const getStatusBadgeClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    SENT: 'bg-blue-100 text-blue-800',
    VIEWED: 'bg-purple-100 text-purple-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

// Load invoices when component mounts
onMounted(() => {
  if (recentInvoices.value.length === 0) {
    invoiceStore.loadInvoices()
  }
})
</script>
