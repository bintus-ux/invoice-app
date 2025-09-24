<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { socketService } from '@/services/socket.service'
import type { InvoiceItem } from '@/types/invoice'

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

// Calculations
const subtotal = computed(() =>
  invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
)
const taxAmount = computed(() => subtotal.value * (invoiceData.taxRate / 100))
const total = computed(() => subtotal.value + taxAmount.value)

// Items management
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

// Submit form
const submitForm = () => {
  if (!invoiceData.clientName || !invoiceData.invoiceDate || !invoiceData.dueDate) {
    alert('Please fill in all required fields')
    return
  }

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

  console.log('📝 New invoice form data:', newInvoice)

  const created = invoiceStore.addInvoice(newInvoice)
  console.log('✅ Added to store:', created)

  console.log('📡 Emitting new invoice to socket:', created)
  socketService.createInvoice(created)
  console.log('📨 Socket emission called for invoice:', created.number)

  emit('create', created)

  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Create New Invoice</h2>
        <button class="text-gray-500 hover:text-gray-800 text-2xl" @click="$emit('close')">
          ×
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-8">
        <!-- Client Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4">Client Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="clientName" class="block text-sm font-medium text-gray-600"
                >Client Name *</label
              >
              <input
                type="text"
                id="clientName"
                v-model="invoiceData.clientName"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="clientEmail" class="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                id="clientEmail"
                v-model="invoiceData.clientEmail"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="clientPhone" class="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="tel"
                id="clientPhone"
                v-model="invoiceData.clientPhone"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="clientAddress" class="block text-sm font-medium text-gray-600"
                >Address</label
              >
              <textarea
                id="clientAddress"
                v-model="invoiceData.clientAddress"
                rows="2"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4">Invoice Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="invoiceDate" class="block text-sm font-medium text-gray-600"
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
              <label for="dueDate" class="block text-sm font-medium text-gray-600"
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
              <label for="currency" class="block text-sm font-medium text-gray-600"
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
              <label for="taxRate" class="block text-sm font-medium text-gray-600"
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

        <!-- Items -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4">Items</h3>
          <div class="space-y-2">
            <!-- Header -->
            <div
              class="grid grid-cols-5 gap-2 bg-gray-100 p-3 rounded-lg font-semibold text-gray-700"
            >
              <div>Description</div>
              <div>Quantity</div>
              <div>Unit Price</div>
              <div>Amount</div>
              <div></div>
            </div>

            <!-- Rows -->
            <div
              v-for="(item, index) in invoiceData.items"
              :key="index"
              class="grid grid-cols-5 gap-2 items-center border-b py-2"
            >
              <input
                type="text"
                v-model="item.description"
                placeholder="Item description"
                required
                class="p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                v-model="item.quantity"
                min="1"
                @change="calculateTotals"
                required
                class="p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                v-model="item.unitPrice"
                min="0"
                step="0.01"
                @change="calculateTotals"
                required
                class="p-2 border border-gray-300 rounded-lg"
              />
              <div class="text-gray-700 font-medium">
                {{ formatCurrency(item.quantity * item.unitPrice) }}
              </div>
              <button
                type="button"
                @click="removeItem(index)"
                class="bg-red-500 text-white rounded-lg w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Add Item -->
          <button
            type="button"
            @click="addItem"
            class="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-gray-600 hover:bg-gray-100"
          >
            + Add Item
          </button>

          <!-- Totals -->
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

        <!-- Notes -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4">Notes</h3>
          <textarea
            v-model="invoiceData.notes"
            placeholder="Additional notes or terms..."
            rows="3"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
