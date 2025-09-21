<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { Component } from 'vue'
import LogoIcon from '../icons/LogoIcon.vue'
import DashboardIcon from '../icons/DashboardIcon.vue'
import OverviewIcon from '../icons/OverviewIcon.vue'
import InvoiceIcon from '../icons/InvoiceIcon.vue'
import BeneficiaryIcon from '../icons/BeneficiaryIcon.vue'
import HelpcenterIcon from '../icons/HelpcenterIcon.vue'
import SettingsIcon from '../icons/SettingsIcon.vue'

const route = useRoute()
const router = useRouter()

// v-model from parent (script-setup compatible pattern)
const isSidebarOpen = defineModel<boolean>('isSidebarOpen')

type NavItem = {
  name: string
  path: string
  icon: Component
}

const navItems: NavItem[] = [
  { name: 'Getting Started', path: '/', icon: DashboardIcon },
  { name: 'Overview', path: '/overview', icon: OverviewIcon },
  { name: 'Accounts', path: '/accounts', icon: DashboardIcon },
  { name: 'Invoice', path: '/invoice', icon: InvoiceIcon },
  { name: 'Beneficiary Management', path: '/beneficiaries', icon: BeneficiaryIcon },
  { name: 'Help Center', path: '/help', icon: HelpcenterIcon },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
]

function navigate(path: string) {
  router.push(path)
  isSidebarOpen.value = false // close on mobile
}
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-screen w-[19.5vw] bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
    :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }"
  >
    <div class="p-6 font-bold text-xl flex items-center gap-3">
      <LogoIcon class="w-6 h-6 text-gray-700" />
    </div>

    <nav class="mt-4 space-y-2 px-2">
      <button
        v-for="item in navItems"
        :key="item.name"
        @click="navigate(item.path)"
        class="w-full flex items-center gap-3 px-6 py-3 rounded-md transition-colors text-gray-600 border-2 border-transparent"
        :class="{
          'bg-white border-4 border-background text-sm text-[#4F4F4F] font-semibold rounded-3xl':
            route.path === item.path,
          'hover:bg-gray-100 text-sm hover:text-blue-600': route.path !== item.path,
        }"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="truncate">{{ item.name }}</span>
      </button>
    </nav>
  </aside>
</template>
