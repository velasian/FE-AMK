<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconUsers from '@/components/icons/IconUsers.vue'
import IconDocument from '@/components/icons/IconDocument.vue'
import { logout as performLogout, useAuth } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()

const menuItems = [
  { label: 'Dashboard', to: { name: 'AdminHome' }, icon: IconHome },
  { label: 'Pegawai', to: { name: 'AdminEmployees' }, icon: IconUsers },
  { label: 'Slip Gaji', to: { name: 'AdminPayslips' }, icon: IconDocument },
]

const activeSectionTitle = computed(() => route.meta.sectionTitle || 'Dashboard')

const userInfo = computed(() => ({
  name: currentUser.value?.name ?? 'Admin',
  role: currentUser.value?.role ?? 'admin',
}))

function handleLogout() {
  performLogout()
  router.replace({ name: 'Login' })
}
</script>

<template>
  <DashboardLayout :menu-items="menuItems" :page-title="activeSectionTitle" :user="userInfo" @logout="handleLogout">
    <RouterView />
  </DashboardLayout>
</template>
