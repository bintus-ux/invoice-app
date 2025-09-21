<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import InvoiceSummeryCards from '@/components/invoices/InvoiceSummeryCards.vue'

const summaryData = {
  totalPaid: 4120102.78,
  totalOverdue: 23000.03,
  totalDraft: 12200.0,
  totalUnpaid: 87102.0,
}
</script>

<template>
  <DashboardLayout>
    <div class="flex items-center justify-center h-[70vh]">
      <div class="invoice-dashboard">
        <InvoiceSummeryCards :summary-data="summaryData" />
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
