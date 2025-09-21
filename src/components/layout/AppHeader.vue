<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import NotificationIcon from '../icons/NotificationIcon.vue'
import ArrowDownIcon from '../icons/ArrowDownIcon.vue'
import HamburgerIcon from '../icons/HamburgerIcon.vue'

const router = useRouter()
const route = useRoute()

const user = ref(auth.currentUser)
const showDropdown = ref(false)

onMounted(() => {
  auth.onAuthStateChanged((u) => {
    user.value = u
  })
})

defineEmits(['toggleSidebar'])

async function logout() {
  await signOut(auth)
  router.push('/login')
}

const initials = computed(() => {
  if (!user.value?.displayName) return 'U'
  const names = user.value.displayName.split(' ')
  return names.length >= 2 ? names[0][0] + names[1][0] : names[0][0]
})

const routeTitles: Record<string, string> = {
  '/': 'Getting Started',
  '/overview': 'Overview',
  '/accounts': 'Accounts',
  '/invoice': 'Invoice',
  '/beneficiaries': 'Beneficiary Management',
  '/help': 'Help Center',
  '/settings': 'Settings',
}

// 2️⃣ Computed property for current page title
const pageTitle = computed(() => {
  return routeTitles[route.path] ?? 'Page'
})
</script>

<template>
  <header>
    <div class="flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <!-- Mobile menu button -->
      <button class="lg:hidden p-2 rounded-md hover:bg-gray-100" @click="$emit('toggleSidebar')">
        <HamburgerIcon />
      </button>

      <h1 class="text-xl md:text-2xl font-medium text-dark-grey">{{ pageTitle }}</h1>

      <div class="flex items-center gap-2 relative">
        <button class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100">
          <NotificationIcon />
        </button>

        <div class="relative">
          <button
            @click="showDropdown = !showDropdown"
            class="flex items-center gap-2 px-3 py-2 rounded-full bg-white border hover:bg-gray-50 shadow-sm"
          >
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full bg-blue text-white font-semibold uppercase"
            >
              {{ initials }}
            </span>
            <ArrowDownIcon />
          </button>

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
