<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useRouter } from 'vue-router'
import NotificationIcon from '../icons/NotificationIcon.vue'
import ArrowDownIcon from '../icons/ArrowDownIcon.vue'

const router = useRouter()
const user = ref(auth.currentUser)
const showDropdown = ref(false)

onMounted(() => {
  auth.onAuthStateChanged((u) => {
    user.value = u
  })
})

async function logout() {
  await signOut(auth)
  router.push('/login')
}

const initials = computed(() => {
  if (!user.value?.displayName) return 'U'
  const names = user.value.displayName.split(' ')
  return names.length >= 2 ? names[0][0] + names[1][0] : names[0][0]
})
</script>

<template>
  <header class="shadow flex items-center justify-between px-6 py-4 border-b border-gray-200">
    <!-- Left: Title -->
    <h1 class="text-xl font-semibold text-gray-800">Invoice</h1>

    <!-- Right: Notification + User -->
    <div class="flex items-center gap-2 relative">
      <!-- Notification -->
      <button class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100">
        <NotificationIcon />
      </button>

      <!-- User Avatar with Arrow -->
      <div class="relative">
        <button
          @click="showDropdown = !showDropdown"
          class="flex items-center gap-2 px-3 py-2 rounded-full bg-white border hover:bg-gray-50 shadow-sm"
        >
          <!-- Avatar Circle -->
          <span
            class="w-8 h-8 flex items-center justify-center rounded-full bg-blue text-white font-semibold uppercase"
          >
            {{ initials }}
          </span>
          <ArrowDownIcon />
        </button>

        <!-- Dropdown -->
        <transition name="fade">
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50"
          >
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-red-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
