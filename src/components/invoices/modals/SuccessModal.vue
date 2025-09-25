<script setup lang="ts">
import CheckIcon from '@/components/icons/CheckIcon.vue'
import { defineProps, defineEmits } from 'vue'

defineProps<{
  title?: string
  message?: string
  visible?: boolean
}>()

const emit = defineEmits<{ (e: 'close'): void }>()
const closeModal = () => emit('close')
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-3xl max-w-md w-full p-6 shadow-lg flex flex-col items-center text-center"
    >
      <div class="bg-green-100 rounded-full p-4 mb-4">
        <CheckIcon class="w-10 h-10 text-green-600" />
      </div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ title || 'Success!' }}</h2>
      <p class="text-gray-700 mb-6">{{ message || 'Invoice created successfully.' }}</p>
      <button
        @click="closeModal"
        class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
      >
        OK
      </button>
    </div>
  </div>
</template>
