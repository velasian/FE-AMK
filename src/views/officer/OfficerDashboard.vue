<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import IconHome from '@/components/icons/IconHome.vue'
import { logout as performLogout, useAuth } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()

const menuItems = [
  { label: 'Dashboard', to: { name: 'OfficerHome' }, icon: IconHome },
]

const activeSectionTitle = computed(() => route.meta.sectionTitle || 'Dashboard')

const userInfo = computed(() => ({
  name: currentUser.value?.name ?? 'Officer',
  role: currentUser.value?.role ?? 'officer',
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
