<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoiceStore } from '@/stores/invoiceStore'
import type { Invoice } from '@/types/invoice'

// Router & store
const router = useRouter()
const invoiceStore = useInvoiceStore()

// State
const isLoading = ref(true)

// Use typed invoices directly from store
const recentInvoices = computed<Invoice[]>(() => invoiceStore.recentInvoices)

// Group invoices by date
const groupedInvoices = computed(() => {
  const groups: Record<string, Invoice[]> = {}

  recentInvoices.value.forEach((invoice) => {
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

    if (!groups[groupDate]) groups[groupDate] = []
    groups[groupDate].push(invoice)
  })

  return groups
})

// Navigation
const navigateToInvoices = () => {
  router.push('/invoices')
}

// Open invoice details
const openInvoiceDetails = (invoice: Invoice) => {
  invoiceStore.openInvoiceModal(invoice)
}

// Formatters
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const getStatusColor = (status: Invoice['status']) => {
  const colors: Record<Invoice['status'], string> = {
    PAID: 'text-green-600',
    OVERDUE: 'text-red-600',
    DRAFT: 'text-gray-600',
    SENT: 'text-blue-600',
    VIEWED: 'text-purple-600',
    PENDING: 'text-yellow-600',
  }
  return colors[status]
}

const getStatusBadgeClass = (status: Invoice['status']) => {
  const classes: Record<Invoice['status'], string> = {
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    SENT: 'bg-blue-100 text-blue-800',
    VIEWED: 'bg-purple-100 text-purple-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
  }
  return classes[status]
}

// Fake API simulation: load invoices after 2s
const loadInvoicesWithDelay = async () => {
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2000))
  await invoiceStore.loadInvoices()
  isLoading.value = false
}

onMounted(() => {
  if (recentInvoices.value.length === 0) loadInvoicesWithDelay()
  else isLoading.value = false
})
</script>

<template>
  <div class="w-full bg-white rounded-2xl p-4">
    <div class="h-[350px] overflow-y-auto no-scrollbar p-2">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-md text-black font-bold">Recent Invoices</h1>
        <button
          @click="navigateToInvoices"
          class="text-xs text-blue hover:bg-blue hover:text-white bg-white py-2 px-6 rounded-full font-medium border border-gray-300"
        >
          View all invoices
        </button>
      </div>

      <!-- Skeleton Loader -->
      <div v-if="isLoading" class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="animate-pulse flex justify-between items-center p-4 border-b border-gray-100 rounded-lg"
        >
          <div class="space-y-2 w-full">
            <div class="h-4 bg-gray-300 rounded w-1/3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div class="h-4 bg-gray-300 rounded w-12"></div>
        </div>
      </div>

      <!-- No invoices -->
      <div
        v-else-if="recentInvoices.length === 0"
        class="flex justify-center items-center h-40 text-gray-500"
      >
        No invoices found
      </div>

      <!-- Invoice list -->
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
