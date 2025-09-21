import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import DashboardView from '@/views/DashboardView.vue'
import InvoiceView from '@/views/InvoiceView.vue'
import AccountsView from '@/views/AccountsView.vue'
import BeneficiarymgtView from '@/views/BeneficiarymgtView.vue'
import OverviewView from '@/views/OverviewView.vue'
import HelpcenterView from '@/views/HelpcenterView.vue'
import SettingsView from '@/views/SettingsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/invoice',
    name: 'Invoice',
    component: InvoiceView,
    meta: { requiresAuth: true },
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: AccountsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/beneficiaries',
    name: 'Beneficiary Management',
    component: BeneficiarymgtView,
    meta: { requiresAuth: true },
  },
  {
    path: '/overview',
    name: 'Overview',
    component: OverviewView,
    meta: { requiresAuth: true },
  },
  {
    path: '/help',
    name: 'Help Center',
    component: HelpcenterView,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

let userChecked = false
router.beforeEach((to, _, next) => {
  if (!userChecked) {
    onAuthStateChanged(auth, (user) => {
      userChecked = true
      if (to.meta.requiresAuth && !user) next('/login')
      else next()
    })
  } else {
    if (to.meta.requiresAuth && !auth.currentUser) next('/login')
    else next()
  }
})

export default router
