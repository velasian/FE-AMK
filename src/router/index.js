import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminOverview from '@/views/admin/AdminOverview.vue'
import AdminEmployees from '@/views/admin/AdminEmployees.vue'
import AdminPayslips from '@/views/admin/AdminPayslips.vue'
import PegawaiDashboard from '@/views/pegawai/PegawaiDashboard.vue'
import PegawaiBiodata from '@/views/pegawai/PegawaiBiodata.vue'
import PegawaiPayslips from '@/views/pegawai/PegawaiPayslips.vue'
import OfficerDashboard from '@/views/officer/OfficerDashboard.vue'
import OfficerPlaceholder from '@/views/officer/OfficerPlaceholder.vue'
import { getCurrentUser, getDashboardPathForRole, isAuthenticated } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard/admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: '',
          name: 'AdminHome',
          component: AdminOverview,
          meta: { sectionTitle: 'Ringkasan' },
        },
        {
          path: 'pegawai',
          name: 'AdminEmployees',
          component: AdminEmployees,
          meta: { sectionTitle: 'Data Pegawai' },
        },
        {
          path: 'slip-gaji',
          name: 'AdminPayslips',
          component: AdminPayslips,
          meta: { sectionTitle: 'Slip Gaji' },
        },
      ],
    },
    {
      path: '/dashboard/pegawai',
      component: PegawaiDashboard,
      meta: { requiresAuth: true, role: 'pegawai' },
      children: [
        {
          path: '',
          name: 'PegawaiBiodata',
          component: PegawaiBiodata,
          meta: { sectionTitle: 'Biodata' },
        },
        {
          path: 'slip-gaji',
          name: 'PegawaiPayslips',
          component: PegawaiPayslips,
          meta: { sectionTitle: 'Slip Gaji' },
        },
      ],
    },
    {
      path: '/dashboard/officer',
      component: OfficerDashboard,
      meta: { requiresAuth: true, role: 'officer' },
      children: [
        {
          path: '',
          name: 'OfficerHome',
          component: OfficerPlaceholder,
          meta: { sectionTitle: 'Dashboard Officer' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const user = getCurrentUser()

  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    if (to.meta.role && user?.role !== to.meta.role) {
      next({ path: getDashboardPathForRole(user?.role) })
      return
    }
  }

  if (to.meta.guestOnly && user) {
    next({ path: getDashboardPathForRole(user.role) })
    return
  }

  next()
})

export default router
