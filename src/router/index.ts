import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import DashboardView from '@/views/DashboardView.vue'
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
