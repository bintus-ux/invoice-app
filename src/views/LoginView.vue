<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <form
      @submit.prevent="onLogin"
      class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mx-auto"
    >
      <!-- App Title -->
      <h1 class="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800">Welcome Back</h1>
      <p class="text-sm text-center text-gray-500 mb-8">Sign in to your account</p>

      <!-- Email -->
      <div class="mb-5">
        <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <!-- Password -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-600 mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign In</span>
      </button>

      <!-- Error Message -->
      <p v-if="error" class="mt-4 text-red-500 text-sm text-center">{{ error }}</p>

      <!-- Signup link -->
      <p class="text-sm text-center text-gray-600 mt-6">
        Don't have an account?
        <RouterLink to="/signup" class="text-blue-600 font-medium hover:underline">
          Sign up
        </RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function onLogin() {
  loading.value = true
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/')
  } catch (e: unknown) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>
