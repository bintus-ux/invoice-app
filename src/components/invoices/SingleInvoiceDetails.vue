<script setup lang="ts">
import { computed } from 'vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import CompanyIcon from '../icons/CompanyIcon.vue'

const invoiceStore = useInvoiceStore()
const invoice = computed(() => invoiceStore.selectedInvoice)

// helpers
function formatDate(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatCurrency(value?: number) {
  if (value == null) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: invoice.value?.currency || 'USD',
  }).format(value)
}

const subtotal = computed(
  () => invoice.value?.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0,
)

const discountRate = computed(() => invoice.value?.discountRate || 0)
const discount = computed(() => (subtotal.value * discountRate.value) / 100)
const total = computed(() => subtotal.value - discount.value)
</script>

<template>
  <div>
    <div class="bg-[#FCDDEC] rounded-2xl p-6">
      <div
        class="flex flex-col items-start md:flex-row md:items-center mb-4 justify-between space-y-4"
      >
        <div class="flex flex-col items-start space-y-2">
          <h1 class="uppercase text-grey text-xs font-semibold">Sender</h1>
          <div class="flex items-center gap-4">
            <CompanyIcon />
            <div class="flex flex-col items-start space-y-2">
              <h2 class="text-sm text-black">{{ invoice?.clientName }}</h2>
              <p class="text-xs text-grey">{{ invoice?.clientPhone }}</p>
              <p class="text-xs text-grey">{{ invoice?.clientEmail }}</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-start space-y-2">
          <h2 class="uppercase text-grey text-xs font-semibold">Customer</h2>
          <h2 class="text-sm text-black">{{ invoice?.clientName }}</h2>
          <p class="text-xs text-grey">{{ invoice?.clientPhone }}</p>
          <p class="text-xs text-grey">{{ invoice?.clientEmail }}</p>
        </div>
      </div>
      <div class="flex flex-col space-y-2">
        <p class="font-semibold text-grey text-sm">Invoice details</p>

        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col">
            <span class="text-xs text-[#666F77] font-medium mb-1">INVOICE NO</span>
            <span class="font-semibold text-black text-xs">{{ invoice?.number }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-[#666F77] font-medium mb-1">ISSUE DATE</span>
            <span class="font-semibold text-black text-xs">{{
              formatDate(invoice?.issueDate)
            }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-[#666F77] font-medium mb-1">DUE DATE</span>
            <span class="font-semibold text-black text-xs">{{ formatDate(invoice?.dueDate) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-[#666F77] font-medium mb-1">CURRENCY</span>
            <span class="font-semibold text-black text-xs">{{ invoice?.currency }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Items -->
    <div class="my-4">
      <div class="flex items-center gap-8">
        <h3 class="text-lg font-semibold text-black">Items</h3>
        <hr class="bg-grey w-full" />
      </div>
      <div>
        <div
          v-for="(item, index) in invoice?.items"
          :key="index"
          class="py-3 border-b border-gray-200 last:border-none"
        >
          <div
            v-for="(item, index) in invoice?.items"
            :key="index"
            class="py-3 border-b border-gray-200 last:border-none"
          >
            <div class="flex justify-between">
              <div>
                <div class="font-medium text-black text-md">{{ item?.description }}</div>
                <div
                  v-if="(item as { details?: string }).details"
                  class="text-sm text-gray-600 mt-1"
                >
                  {{ (item as { details?: string }).details }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-600">Qty: {{ item?.quantity }}</div>
                <div class="text-sm text-gray-600">
                  {{ formatCurrency(item?.unitPrice) }}
                </div>
                <div class="font-semibold">
                  {{ formatCurrency(item?.quantity * item?.unitPrice) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>{{ formatCurrency(subtotal) }}</span>
          </div>
          <div v-if="discount > 0" class="flex justify-between text-gray-700">
            <span>Discount ({{ discountRate }}%)</span>
            <span>-{{ formatCurrency(discount) }}</span>
          </div>
          <div
            class="flex justify-between font-semibold text-gray-900 text-lg border-t border-gray-300 pt-2"
          >
            <span>Total Amount Due</span>
            <span>{{ formatCurrency(total) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Information -->
    <div class="border border-[#E3E6EF] rounded-2xl p-4 my-6">
      <h3 class="text-xs font-semibold text-[#697598] mb-4">PAYMENT INFORMATION</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <span class="text-xs text-[#666F77] font-medium mb-1">ACCOUNT NAME</span>
          <span class="font-semibold text-black text-xs">{{ invoice?.number }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-[#666F77] font-medium mb-1">ACCOUNT NUMBER</span>
          <span class="font-semibold text-black text-xs">{{ invoice?.issueDate }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-[#666F77] font-medium mb-1">BANK NAME</span>
          <span class="font-semibold text-black text-xs">{{ invoice?.reference }}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="flex flex-col justify-start items-start bg-[#F6F8FA] rounded-2xl p-4">
      <p class="text-[#B7BDCF] text-sm uppercase">Note</p>
      <p class="text-[#666F77] text-md">Thank you for your patronage</p>
    </div>
  </div>
</template>
