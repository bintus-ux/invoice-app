<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { socketService } from '@/services/socket.service'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useActivityStore } from '@/stores/activityStore'
import type { NewInvoiceData } from '@/types/newInvoiceData'
import type { InvoiceUpdateData } from '@/types/invoiceUpdate'

const socketConnected = ref(false)
const invoiceStore = useInvoiceStore()
const activityStore = useActivityStore()

interface NotificationData {
  type: string
  message: string
}

onMounted(() => {
  // Connect to socket server
  socketService.connect()
  socketConnected.value = socketService.connected

  // 📡 Invoice updated
  socketService.onInvoiceUpdated((data: InvoiceUpdateData) => {
    console.log('📝 Invoice updated:', data)

    invoiceStore.updateInvoiceStatus(data.id, data.status)
    showNotification(`Invoice #${data.id} status changed to ${data.status}`)

    // 👇 Log as activity
    activityStore.pushActivity({
      id: Date.now(),
      actor: 'System', // or current user if available
      action: `Invoice #${data.id} updated → ${data.status}`,
      time: data.updatedAt,
    })
  })

  // 📡 New invoice created
  socketService.onInvoiceCreated((data: NewInvoiceData) => {
    console.log('🆕 New invoice created (from socket):', data)

    invoiceStore.pushInvoice({
      ...data,
      reference: `REF-${data.id}`,
      dueDate: new Date().toISOString(),
      clientPhone: `${data.clientName}-phone`,
      clientEmail: `${data.clientName}@example.com`,
      issueDate: data.createdAt,
      currency: 'USD',
      items: [],
    })

    showNotification(`New invoice created: #${data.number}`)

    // 👇 Log as activity
    activityStore.pushActivity({
      id: Date.now(),
      actor: data.clientName,
      action: `Created invoice #${data.number}`,
      time: data.createdAt,
    })
  })

  // 📡 General notifications
  socketService.onNotification((data: NotificationData) => {
    console.log('🔔 Notification:', data)
    showNotification(data.message)
  })

  // 🔑 Ask for notification permission once when mounted
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      console.log(`🔑 Notification permission: ${permission}`)
    })
  }
})

onUnmounted(() => {
  socketService.disconnect()
  socketService.removeListeners()
})

const showNotification = (message: string) => {
  console.log('💬 Notification:', message)

  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('Invoice App', { body: message })
    }
  }
}
</script>

<template>
  <div>
    <!-- Connection status indicator -->
    <div v-if="socketConnected" class="fixed top-4 right-4 z-50">
      <div class="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        Live
      </div>
    </div>

    <RouterView />
  </div>
</template>
