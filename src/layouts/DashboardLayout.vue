<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <AppSidebar v-model:isSidebarOpen="isSidebarOpen" />

    <!-- Main content wrapper -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-sidebar">
      <!-- Header -->
      <AppHeader @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <!-- Page content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
