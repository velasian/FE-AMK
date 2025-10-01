import { createRouter, createWebHistory } from 'vue-router'

const roleRouteMap = {
  admin: { name: 'admin-dashboard', path: '/dashboard/admin' },
  pegawai: { name: 'pegawai-dashboard', path: '/dashboard/pegawai' },
  officer: { name: 'officer-dashboard', path: '/dashboard/officer' }
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/dashboard/admin',
    name: 'admin-dashboard',
    meta: { requiresAuth: true, role: 'admin' },
    component: () => import('../views/AdminDashboard.vue')
  },
  {
    path: '/dashboard/pegawai',
    name: 'pegawai-dashboard',
    meta: { requiresAuth: true, role: 'pegawai' },
    component: () => import('../views/PegawaiDashboard.vue')
  },
  {
    path: '/dashboard/officer',
    name: 'officer-dashboard',
    meta: { requiresAuth: true, role: 'officer' },
    component: () => import('../views/OfficerDashboard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (typeof window === 'undefined') {
    next()
    return
  }

  const rawUser = window.localStorage.getItem('authUser')
  const user = rawUser ? JSON.parse(rawUser) : null

  if (to.name === 'login' && user?.role) {
    const target = roleRouteMap[user.role]
    if (target) {
      next({ name: target.name })
      return
    }
  }

  if (to.meta?.requiresAuth && !user) {
    next({ name: 'login' })
    return
  }

  if (to.meta?.requiresAuth && user?.role && to.meta.role !== user.role) {
    const target = roleRouteMap[user.role]
    if (target) {
      next({ name: target.name })
      return
    }
  }

  next()
})

export default router
