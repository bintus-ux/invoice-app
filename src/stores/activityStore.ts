import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Activity } from '@/types/activity'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])

  const recentActivities = computed(() => activities.value.slice(0, 5))

  const pushActivity = (newActivity: Activity) => {
    activities.value.unshift(newActivity)
  }

  return {
    activities,
    recentActivities,
    pushActivity,
  }
})
