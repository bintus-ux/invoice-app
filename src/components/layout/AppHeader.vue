<template>
  <header class="bg-white shadow flex items-center justify-between px-6 py-4">
    <h1 class="text-xl font-semibold text-gray-800">Invoice App</h1>
    <div class="flex items-center gap-4">
      <span class="font-medium text-gray-700">{{ user?.email }}</span>
      <button
        @click="logout"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(auth.currentUser)

onMounted(() => {
  auth.onAuthStateChanged((u) => {
    user.value = u
  })
})

async function logout() {
  await signOut(auth)
  router.push('/login')
}
</script>
