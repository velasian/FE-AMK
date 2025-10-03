import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import EmployeeDashboard from '../views/EmployeeDashboard.vue'
import { ROLE_ROUTES, getStoredUser } from '../utils/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/pegawai',
    name: 'employee-dashboard',
    component: EmployeeDashboard,
    meta: { requiresAuth: true, role: 'pegawai' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = getStoredUser()

  if (to.meta.requiresAuth && !user) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.role && user && to.meta.role !== user.role) {
    next({ path: ROLE_ROUTES[user.role] || '/login' })
    return
  }

  if (to.name === 'login' && user) {
    next({ path: ROLE_ROUTES[user.role] || '/admin' })
    return
  }

  next()
})

export default router
