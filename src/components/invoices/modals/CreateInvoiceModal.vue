<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { socketService } from '@/services/socket.service'
import type { InvoiceItem } from '@/types/invoice'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import LoadingSpinner from '@/components/icons/LoadingSpinner.vue'

const invoiceStore = useInvoiceStore()
const emit = defineEmits(['close', 'create'])

const invoiceData = reactive<{
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  invoiceDate: string
  dueDate: string
  currency: string
  taxRate: number
  notes: string
  items: InvoiceItem[]
}>({
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientAddress: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  currency: 'USD',
  taxRate: 0,
  notes: '',
  items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
})

const isLoading = ref(false)

const isFormValid = computed(() => {
  return (
    invoiceData.clientName.trim() !== '' &&
    invoiceData.invoiceDate.trim() !== '' &&
    invoiceData.dueDate.trim() !== '' &&
    invoiceData.items.every(
      (item) => item.description.trim() !== '' && item.quantity > 0 && item.unitPrice >= 0,
    )
  )
})

const subtotal = computed(() =>
  invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
)
const taxAmount = computed(() => subtotal.value * (invoiceData.taxRate / 100))
const total = computed(() => subtotal.value + taxAmount.value)

const addItem = () =>
  invoiceData.items.push({ description: '', quantity: 1, unitPrice: 0, total: 0 })
const removeItem = (index: number) => {
  if (invoiceData.items.length > 1) invoiceData.items.splice(index, 1)
}
const calculateTotals = () => {
  invoiceData.items.forEach((item) => {
    item.total = item.quantity * item.unitPrice
  })
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: invoiceData.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

const submitForm = async () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }

  isLoading.value = true

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const newInvoice = {
    number: `INV-${Math.floor(Math.random() * 100000)}`,
    reference: `REF-${Date.now()}`,
    dueDate: invoiceData.dueDate,
    amount: total.value,
    status: 'DRAFT' as const,
    clientName: invoiceData.clientName,
    clientPhone: invoiceData.clientPhone,
    clientEmail: invoiceData.clientEmail,
    issueDate: invoiceData.invoiceDate,
    currency: invoiceData.currency,
    items: invoiceData.items.map((item: InvoiceItem) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
      details: '',
    })),
  }

  console.log('New invoice form data:', newInvoice)

  const created = invoiceStore.addInvoice(newInvoice)
  socketService.createInvoice(created)
  emit('create', created)

  isLoading.value = false
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-4xl">
      <button
        class="absolute -top-14 right-[-10px] sm:-top-[50px] sm:-right-[7px] p-2 text-gray-500 hover:text-gray-700 transition-colors"
        @click="$emit('close')"
        :disabled="isLoading"
      >
        <CloseIcon class="w-10 h-10" />
      </button>

      <div class="bg-white rounded-4xl w-full max-h-[80vh] overflow-y-auto shadow-xl no-scrollbar">
        <div class="flex justify-between items-center p-6">
          <h2 class="text-2xl font-semibold text-black">Create New Invoice</h2>
        </div>
        <hr class="text-grey mx-4" />

        <form @submit.prevent="submitForm" class="p-6 space-y-8">
          <div>
            <h3 class="text-lg font-bold text-gray-700 mb-4">Client Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="clientName" class="block text-sm md:text-lg font-medium text-grey mb-2"
                  >Client Name *</label
                >
                <input
                  type="text"
                  id="clientName"
                  v-model="invoiceData.clientName"
                  required
                  placeholder="Input name"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label for="clientEmail" class="block text-sm md:text-lg font-medium text-grey mb-2"
                  >Email</label
                >
                <input
                  type="email"
                  id="clientEmail"
                  v-model="invoiceData.clientEmail"
                  placeholder="Input email"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label for="clientPhone" class="block text-sm md:text-lg font-medium text-grey mb-2"
                  >Phone</label
                >
                <input
                  type="tel"
                  id="clientPhone"
                  v-model="invoiceData.clientPhone"
                  placeholder="Input phone number"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  for="clientAddress"
                  class="block text-sm md:text-lg font-medium text-grey mb-2"
                  >Address</label
                >
                <textarea
                  id="clientAddress"
                  v-model="invoiceData.clientAddress"
                  placeholder="Input address..."
                  rows="2"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-700 mb-4">Invoice Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="invoiceDate" class="block text-sm md:text-lg font-medium text-grey mb-2"
                  >Invoice Date *</label
                >
                <input
                  type="date"
                  id="invoiceDate"
                  v-model="invoiceData.invoiceDate"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label for="dueDate" class="block text-sm md:text-lg font-medium text-grey mb-2"
                  >Due Date *</label
                >
                <input
                  type="date"
                  id="dueDate"
                  v-model="invoiceData.dueDate"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label for="currency" class="block text-sm md:text-lg font-medium text-grey mb-2"
                  >Currency *</label
                >
                <select
                  id="currency"
                  v-model="invoiceData.currency"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label for="taxRate" class="block text-sm md:text-lg font-medium text-grey mb-2"
                  >Tax Rate (%)</label
                >
                <input
                  type="number"
                  id="taxRate"
                  v-model="invoiceData.taxRate"
                  min="0"
                  step="0.1"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-700 mb-4">Items</h3>
            <div class="space-y-2">
              <div
                class="hidden md:grid md:grid-cols-5 gap-2 bg-gray-100 p-3 rounded-lg font-semibold text-gray-700"
              >
                <p class="text-sm text-black font-bold">Description</p>
                <p class="text-sm text-black font-bold">Quantity</p>
                <p class="text-sm text-black font-bold">Unit Price</p>
                <p class="text-sm text-black font-bold">Amount</p>
                <p></p>
              </div>

              <div
                v-for="(item, index) in invoiceData.items"
                :key="index"
                class="grid grid-cols-1 md:grid-cols-5 gap-2 items-start border-b py-3 rounded-lg"
              >
                <div class="flex flex-col space-y-2">
                  <label class="text-sm text-gray-500 md:hidden">Description</label>
                  <input
                    type="text"
                    v-model="item.description"
                    placeholder="Item description"
                    required
                    class="p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div class="flex flex-col space-y-2">
                  <label class="text-sm text-gray-500 md:hidden">Quantity</label>
                  <input
                    type="number"
                    v-model="item.quantity"
                    min="1"
                    @change="calculateTotals"
                    required
                    class="p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div class="flex flex-col space-y-2">
                  <label class="text-sm text-gray-500 md:hidden">Unit Price</label>
                  <input
                    type="number"
                    v-model="item.unitPrice"
                    min="0"
                    step="0.01"
                    @change="calculateTotals"
                    required
                    class="p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div class="flex flex-col space-y-2">
                  <label class="text-sm text-gray-500 md:hidden">Amount</label>
                  <div class="text-gray-700 font-medium">
                    {{ formatCurrency(item.quantity * item.unitPrice) }}
                  </div>
                </div>
                <div class="flex items-center justify-start md:justify-center">
                  <button
                    type="button"
                    @click="removeItem(index)"
                    class="bg-red-500 text-white rounded-lg w-8 h-8 flex items-center justify-center"
                    :disabled="isLoading"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="addItem"
              class="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-grey hover:bg-gray-100"
              :disabled="isLoading"
            >
              + Add Item
            </button>

            <div class="mt-4 border-t pt-4 space-y-2">
              <div class="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-700">
                <span>Tax ({{ invoiceData.taxRate }}%):</span>
                <span>{{ formatCurrency(taxAmount) }}</span>
              </div>
              <div class="flex justify-between font-semibold text-lg text-gray-900 border-t pt-2">
                <span>Total:</span>
                <span>{{ formatCurrency(total) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-4">Notes</h3>
            <textarea
              v-model="invoiceData.notes"
              placeholder="Additional notes or terms..."
              rows="3"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :disabled="isLoading"
            ></textarea>
          </div>

          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t w-full">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              :class="[
                'px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto min-w-[150px]',
                isLoading || !isFormValid
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue text-white hover:bg-blue-700',
              ]"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <LoadingSpinner />
                <span>Creating...</span>
              </span>
              <span v-else> Create Invoice </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
