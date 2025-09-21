<script setup lang="ts">
import NotFoundIcon from '@/components/icons/NotFoundIcon.vue'
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
    <div class="mb-8">
      <NotFoundIcon />
    </div>

    <h1 class="text-5xl font-extrabold text-gray-800 mb-4">404</h1>
    <p class="text-xl text-gray-600 mb-6">Oops! The page you are looking for doesn’t exist.</p>

    <div class="flex flex-col sm:flex-row gap-4">
      <router-link
        to="/"
        class="px-6 py-3 bg-blue text-white font-semibold rounded-lg hover:bg-sky-300 transition"
      >
        Go to Home
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* Optional: add a subtle bounce animation to the icon */
svg {
  animation: bounce 1.2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
