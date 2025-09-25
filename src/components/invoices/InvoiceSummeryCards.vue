<script lang="ts" setup>
import OverviewIcon from '../icons/OverviewIcon.vue'
import { ref } from 'vue'
import CreateInvoiceModal from './modals/CreateInvoiceModal.vue'
import type { Invoice } from '@/types/invoice'

const showCreateModal = ref(false)

const emit = defineEmits<{
  (e: 'invoice-created', invoice: Invoice): void
}>()

const openCreateModal = () => (showCreateModal.value = true)
const closeCreateModal = () => (showCreateModal.value = false)
const handleInvoiceCreate = (invoiceData: Invoice) => {
  closeCreateModal()
  emit('invoice-created', invoiceData)
}

const props = defineProps<{
  summaryData?: {
    totalPaid: number
    totalOverdue: number
    totalDraft: number
    totalUnpaid: number
  }
}>()

const summaryData = props.summaryData ?? {
  totalPaid: 4120102.78,
  totalOverdue: 23000.03,
  totalDraft: 12200.0,
  totalUnpaid: 87102.0,
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

const summaryCards = [
  {
    label: 'Total Paid',
    value: summaryData.totalPaid,
    icon: OverviewIcon,
    count: 12,
    color: 'bg-green-200',
  },
  {
    label: 'Total Overdue',
    value: summaryData.totalOverdue,
    icon: OverviewIcon,
    count: 3,
    color: 'bg-red-200',
  },
  {
    label: 'Total Draft',
    value: summaryData.totalDraft,
    icon: OverviewIcon,
    count: 5,
    color: 'bg-yellow-200',
  },
  {
    label: 'Total Unpaid',
    value: summaryData.totalUnpaid,
    icon: OverviewIcon,
    count: 8,
    color: 'bg-blue-200',
  },
]
</script>

<template>
  <div class="flex flex-col gap-6 w-full mb-8">
    <div
      class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-4 w-full"
    >
      <h1 class="text-black text-xl md:text-3xl font-bold">Invoice</h1>

      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <button
          class="bg-white text-gray-500 font-medium text-sm py-2 px-6 rounded-full hover:bg-gray-200 hover:text-black transition"
        >
          SEE WHAT'S NEW
        </button>
        <button
          class="bg-blue text-white bg-blue hover:text-blue hover:bg-white font-medium text-sm py-2 px-6 rounded-full hover:bg-blue transition"
          @click="openCreateModal"
        >
          CREATE
        </button>
      </div>
    </div>

    <div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] w-full">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="flex flex-col p-5 rounded-2xl bg-white"
      >
        <component :is="card.icon" class="w-8 h-8 text-blue-500 mb-3" />
        <div class="flex items-center justify-between w-full mb-2">
          <h3 class="text-xs text-gray-500 font-medium">{{ card.label }}</h3>
          <div
            :class="[
              'w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold',
              card.color,
            ]"
          >
            {{ card.count }}
          </div>
        </div>
        <p class="text-xl font-bold text-black">{{ formatCurrency(card.value) }}</p>
      </div>
    </div>
    <CreateInvoiceModal
      v-if="showCreateModal"
      @close="closeCreateModal"
      @create="handleInvoiceCreate"
    />
  </div>
</template>
