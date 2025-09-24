<script setup lang="ts">
import { computed } from 'vue'
import { useInvoiceStore } from '@/stores/invoiceStore'
import AvatarIcon from '../icons/AvatarIcon.vue'

// store
const invoiceStore = useInvoiceStore()
const invoice = computed(() => invoiceStore.selectedInvoice)

const activities = computed(() => {
  if (!invoice.value) return []
  return [
    {
      actor: 'You',
      time: 'Today, 12:20 PM',
      action: `Created invoice ${invoice.value.number}/${invoice.value.clientName}`,
    },
    {
      actor: 'You',
      time: 'Today, 12:20 PM',
      action: `Sent invoice ${invoice.value.number}/${invoice.value.clientName} to ${invoice.value.clientName}`,
    },
    {
      actor: 'Payment Confirmed',
      time: 'Today, 12:20 PM',
      action: `You manually confirmed a full payment of ${invoice.value.amount}`,
    },
  ]
})
</script>

<template>
  <div>
    <h3 class="text-md font-semibold text-black mb-6">INVOICE ACTIVITY</h3>

    <div class="relative">
      <!-- Main vertical line that runs through all items -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <!-- Activity loop -->
      <div
        v-for="(activity, index) in activities"
        :key="index"
        class="relative flex items-start pl-9 pb-6 last:pb-0"
      >
        <!-- Avatar positioned exactly on the line -->
        <div class="absolute left-0 top-0 z-10">
          <div
            class="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-white"
          >
            <AvatarIcon />
          </div>
        </div>

        <!-- Activity content -->
        <div class="min-h-[2rem]">
          <div class="flex flex-col items-baseline gap-1">
            <span class="font-semibold text-gray-900">{{ activity.actor }}</span>
            <span class="text-sm text-gray-500">{{ activity.time }}</span>
          </div>
          <div class="mt-1 text-gray-700 text-xs leading-relaxed bg-[#F6F8FA] rounded-xl px-3 py-2">
            {{ activity.action }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="activities.length === 0" class="text-gray-500 italic">No activity recorded</div>
  </div>
</template>
