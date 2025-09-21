<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Create New Invoice</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="submitForm" class="invoice-form">
        <!-- Client Information -->
        <div class="form-section">
          <h3>Client Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="clientName">Client Name *</label>
              <input type="text" id="clientName" v-model="invoiceData.clientName" required />
            </div>
            <div class="form-group">
              <label for="clientEmail">Email</label>
              <input type="email" id="clientEmail" v-model="invoiceData.clientEmail" />
            </div>
            <div class="form-group">
              <label for="clientPhone">Phone</label>
              <input type="tel" id="clientPhone" v-model="invoiceData.clientPhone" />
            </div>
            <div class="form-group">
              <label for="clientAddress">Address</label>
              <textarea id="clientAddress" v-model="invoiceData.clientAddress" rows="2"></textarea>
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div class="form-section">
          <h3>Invoice Details</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="invoiceDate">Invoice Date *</label>
              <input type="date" id="invoiceDate" v-model="invoiceData.invoiceDate" required />
            </div>
            <div class="form-group">
              <label for="dueDate">Due Date *</label>
              <input type="date" id="dueDate" v-model="invoiceData.dueDate" required />
            </div>
            <div class="form-group">
              <label for="currency">Currency *</label>
              <select id="currency" v-model="invoiceData.currency" required>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="taxRate">Tax Rate (%)</label>
              <input type="number" id="taxRate" v-model="invoiceData.taxRate" min="0" step="0.1" />
            </div>
          </div>
        </div>

        <!-- Invoice Items -->
        <div class="form-section">
          <h3>Items</h3>
          <div class="items-table">
            <div class="table-header">
              <div>Description</div>
              <div>Quantity</div>
              <div>Unit Price</div>
              <div>Amount</div>
              <div></div>
            </div>

            <div v-for="(item, index) in invoiceData.items" :key="index" class="table-row">
              <div>
                <input
                  type="text"
                  v-model="item.description"
                  placeholder="Item description"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  v-model="item.quantity"
                  min="1"
                  @change="calculateTotals"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  v-model="item.unitPrice"
                  min="0"
                  step="0.01"
                  @change="calculateTotals"
                  required
                />
              </div>
              <div>
                {{ formatCurrency(item.quantity * item.unitPrice) }}
              </div>
              <div>
                <button type="button" @click="removeItem(index)" class="remove-btn">×</button>
              </div>
            </div>
          </div>

          <button type="button" @click="addItem" class="add-item-btn">+ Add Item</button>

          <!-- Totals -->
          <div class="invoice-totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="total-row">
              <span>Tax ({{ invoiceData.taxRate }}%):</span>
              <span>{{ formatCurrency(taxAmount) }}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>{{ formatCurrency(total) }}</span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="form-section">
          <h3>Notes</h3>
          <textarea
            v-model="invoiceData.notes"
            placeholder="Additional notes or terms..."
            rows="3"
          ></textarea>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">Cancel</button>
          <button type="submit" class="btn-submit">Create Invoice</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

const emit = defineEmits(['close', 'create'])

// Invoice form data
const invoiceData = reactive({
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientAddress: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  currency: 'USD',
  taxRate: 0,
  notes: '',
  items: [
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
    },
  ],
})

// Calculations
const subtotal = computed(() => {
  return invoiceData.items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice
  }, 0)
})

const taxAmount = computed(() => {
  return subtotal.value * (invoiceData.taxRate / 100)
})

const total = computed(() => {
  return subtotal.value + taxAmount.value
})

// Item management
const addItem = () => {
  invoiceData.items.push({
    description: '',
    quantity: 1,
    unitPrice: 0,
  })
}

const removeItem = (index: number) => {
  if (invoiceData.items.length > 1) {
    invoiceData.items.splice(index, 1)
    calculateTotals()
  }
}

const calculateTotals = () => {
  // Computed properties will automatically update
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: invoiceData.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Form submission
const submitForm = () => {
  // Validate form
  if (!invoiceData.clientName || !invoiceData.invoiceDate || !invoiceData.dueDate) {
    alert('Please fill in all required fields')
    return
  }

  // Emit the created invoice data
  emit('create', {
    ...invoiceData,
    subtotal: subtotal.value,
    taxAmount: taxAmount.value,
    total: total.value,
    status: 'draft',
  })

  // Close modal
  emit('close')
}
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

/* Form Styles */
.invoice-form {
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

/* Items Table */
.items-table {
  margin-bottom: 16px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-weight: 600;
  color: #333;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  gap: 12px;
  padding: 12px;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.table-row input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-item-btn {
  background: #f1f3f4;
  border: 1px dashed #ddd;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 16px;
}

.add-item-btn:hover {
  background: #e8eaed;
}

/* Totals */
.invoice-totals {
  border-top: 2px solid #eee;
  padding-top: 16px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.grand-total {
  font-weight: bold;
  font-size: 18px;
  border-top: 1px solid #eee;
  margin-top: 8px;
  padding-top: 12px;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.btn-cancel {
  padding: 12px 24px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.btn-submit {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #1976d2;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-submit:hover {
  background: #1565c0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
