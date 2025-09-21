<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AppSidebar v-model:isSidebarOpen="isSidebarOpen" />

    <!-- Main content wrapper -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-[19.5vw]">
      <!-- Header -->
      <AppHeader @toggleSidebar="isSidebarOpen = !isSidebarOpen" class="sticky top-0 z-30" />

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
