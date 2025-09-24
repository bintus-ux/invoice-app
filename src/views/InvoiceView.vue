<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import InvoiceSummeryCards from '@/components/invoices/InvoiceSummeryCards.vue'
import InvoiceActions from '@/components/invoices/InvoiceActions.vue'
import RecentInvoices from '@/components/invoices/RecentInvoices.vue'
import RecentActivities from '@/components/invoices/RecentActivities.vue'
import InvoiceDetailsModal from '@/components/invoices/modals/InvoiceDetailsModal.vue'
import type { Invoice } from '@/types/invoice'

const summaryData = {
  totalPaid: 4120102.78,
  totalOverdue: 23000.03,
  totalDraft: 12200.0,
  totalUnpaid: 87102.0,
}

const selectedInvoice = ref<Invoice | null>(null)
const showInvoiceModal = ref(false)

const openInvoiceDetails = (invoice: Invoice) => {
  selectedInvoice.value = invoice
  showInvoiceModal.value = true
}
</script>

<template>
  <DashboardLayout>
    <div class="flex items-center justify-center">
      <div class="invoice-dashboard">
        <InvoiceSummeryCards :summary-data="summaryData" />
        <InvoiceActions />
        <div class="w-full h-auto flex flex-col md:flex-row justify-between gap-8">
          <div class="w-full md:w-[60%]">
            <RecentInvoices @invoice-selected="openInvoiceDetails" />
          </div>
          <div class="w-full md:w-[40%]">
            <div class="h-[350px] w-full bg-white rounded-4xl p-6 overflow-y-auto">
              <div class="flex justify-between items-center mb-4">
                <h1 class="text-xl text-black font-medium">Recent activities</h1>
                <button
                  class="text-xs text-blue hover:bg-blue hover:text-white bg-white py-2 px-6 rounded-full font-medium border border-grey"
                >
                  View all
                </button>
              </div>

              <RecentActivities />
            </div>
          </div>
        </div>
        <InvoiceDetailsModal />
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.invoice-dashboard {
  width: 100%;
  height: 100%;
}
</style>
