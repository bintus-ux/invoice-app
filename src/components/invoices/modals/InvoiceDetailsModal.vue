<script setup lang="ts">
import { computed } from 'vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import ReminderSection from '../ReminderSection.vue'
import ActivityTimeline from '../ActivityTimeline.vue'
import SingleInvoiceDetails from '../SingleInvoiceDetails.vue'

const invoiceStore = useInvoiceStore()

const isOpen = computed(() => {
  return invoiceStore.isModalOpen
})
const invoice = computed(() => invoiceStore.selectedInvoice)

const closeModal = () => {
  invoiceStore.closeInvoiceModal()
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
</script>

<template>
  <div
    v-if="isOpen && invoice"
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    @click.self="closeModal"
  >
    <div class="relative w-full sm:w-[90%] md:w-[80%] lg:w-[80%] mt-5">
      <button
        class="absolute -top-9 -right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        @click="closeModal"
      >
        <CloseIcon />
      </button>

      <div
        class="bg-white rounded-[30px] md:rounded-[40px] overflow-y-auto max-h-[90vh] mt-5 p-4 sm:p-8 space-y-6 no-scrollbar"
      >
        <!-- Header -->
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
        >
          <div>
            <h2 class="text-2xl md:text-xl font-semibold text-black mb-1">
              Invoice - {{ invoice.number }} - {{ invoice.reference }}
            </h2>
            <p class="text-xs text-[#697598]">View the details and activity of this invoice</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              class="uppercase px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white text-xs text-blue border border-gray"
            >
              Download as PDF
            </button>
            <button
              class="uppercase px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-blue text-xs text-white"
            >
              Send Invoice
            </button>
            <button
              class="uppercase px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white text-xs text-black border border-gray"
            >
              More
            </button>
          </div>
        </div>

        <div>
          <span class="text-xs px-2 py-1 rounded-full" :class="getStatusBadgeClass(invoice.status)">
            {{ invoice.status }}
          </span>
        </div>
        <ReminderSection />

        <!-- Invoice Details & Activity -->
        <div class="flex flex-col md:flex-row justify-between w-full gap-6 md:gap-8">
          <div class="w-full md:w-[60%] border border-[#E3E6EF] rounded-4xl p-4 sm:p-6">
            <SingleInvoiceDetails />
          </div>

          <div class="w-full md:w-[40%] my-4 md:mt-0">
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
