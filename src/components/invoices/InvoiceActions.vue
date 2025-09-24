<script setup lang="ts">
import { ref } from 'vue'
import CreateInvoiceModal from '@/components/invoices/modals/CreateInvoiceModal.vue'
import CashIcon from '../icons/CashIcon.vue'
import InvoiceSettingsIcon from '../icons/InvoiceSettingsIcon.vue'
import CustomerListIcon from '../icons/CustomerListIcon.vue'

const showCreateModal = ref(false)

// Modal functions
const openCreateModal = () => (showCreateModal.value = true)
const closeCreateModal = () => (showCreateModal.value = false)
const handleInvoiceCreate = (invoiceData: unknown) => {
  console.log('New invoice created:', invoiceData)
  closeCreateModal()
}

const openSettingsModal = () => console.log('Open settings modal')
const openCustomersModal = () => console.log('Open customers modal')
</script>

<template>
  <div class="mb-8">
    <div class="flex justify-between items-center mb-4 w-full gap-2">
      <h2 class="text-xl font-semibold text-black">Invoice Actions</h2>
      <hr class="border border-[#FFFFFF] w-[80%]" />
    </div>

    <div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
      <!-- Create New Invoice Card -->
      <div
        class="bg-white text-dark-grey hover:text-white p-6 rounded-2xl flex flex-col items-start cursor-pointer transition-all duration-300 hover:bg-blue hover:text-white hover:-translate-y-1 hover:shadow-lg"
        @click="openCreateModal"
      >
        <div class="mb-4 text-blue-700 group-hover:text-white">
          <CashIcon />
        </div>
        <h3 class="text-xl font-semibold mb-2">Create New Invoice</h3>
        <p class="text-sm group-hover:text-white">Create new invoice easily</p>
      </div>

      <!-- Change Invoice Settings Card -->
      <div
        class="bg-white text-dark-grey hover:text-white p-6 rounded-2xl flex flex-col items-start cursor-pointer transition-all duration-300 hover:bg-blue hover:text-white hover:-translate-y-1 hover:shadow-lg"
        @click="openSettingsModal"
      >
        <div class="mb-4 text-blue-700 group-hover:text-white">
          <InvoiceSettingsIcon />
        </div>
        <h3 class="text-xl font-semibold mb-2">Change Invoice Settings</h3>
        <p class="text-sm">Customize your invoices</p>
      </div>

      <!-- Manage Customer List Card -->
      <div
        class="bg-white text-dark-grey hover:text-white p-6 rounded-2xl flex flex-col items-start cursor-pointer transition-all duration-300 hover:bg-blue hover:text-white hover:-translate-y-1 hover:shadow-lg"
        @click="openCustomersModal"
      >
        <div class="mb-4 text-blue-700 group-hover:text-white">
          <CustomerListIcon />
        </div>
        <h3 class="text-xl font-semibold mb-2">Manage Customer List</h3>
        <p class="text-sm group-hover:text-white">Add and remove customers</p>
      </div>
    </div>

    <!-- Create Invoice Modal -->
    <CreateInvoiceModal
      v-if="showCreateModal"
      @close="closeCreateModal"
      @create="handleInvoiceCreate"
    />
  </div>
</template>
