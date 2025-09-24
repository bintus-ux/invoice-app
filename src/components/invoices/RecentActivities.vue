<template>
  <div>
    <h3 class="text-md font-semibold text-black mb-6">INVOICE ACTIVITY</h3>

    <div class="relative">
      <!-- Vertical line -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <!-- Loop activities -->
      <div
        v-for="(activity, index) in activityStore.activities"
        :key="activity.id"
        class="relative flex items-start pl-9 pb-6 last:pb-0"
      >
        <!-- Avatar -->
        <div class="absolute left-0 top-0 z-10">
          <div
            class="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-white"
          >
            <AvatarIcon />
          </div>
        </div>

        <!-- Content -->
        <div class="min-h-[2rem]">
          <div class="flex flex-col items-baseline gap-1">
            <span class="font-semibold text-gray-900">{{ activity.actor }}</span>
            <span class="text-sm text-gray-500">
              {{ new Date(activity.time).toLocaleString() }}
            </span>
          </div>
          <div class="mt-1 text-gray-700 text-xs leading-relaxed bg-[#F6F8FA] rounded-xl px-3 py-2">
            {{ activity.action }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="activityStore.activities.length === 0" class="text-gray-500 italic">
      No activity recorded
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore'
import AvatarIcon from '@/components/icons/AvatarIcon.vue'

const activityStore = useActivityStore()
</script>
