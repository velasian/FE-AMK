<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import IconProfile from '@/components/icons/IconProfile.vue'
import IconDocument from '@/components/icons/IconDocument.vue'
import { logout as performLogout, useAuth } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()

const menuItems = [
  { label: 'Biodata', to: { name: 'PegawaiBiodata' }, icon: IconProfile },
  { label: 'Slip Gaji', to: { name: 'PegawaiPayslips' }, icon: IconDocument },
]

const activeSectionTitle = computed(() => route.meta.sectionTitle || 'Dashboard')

const userInfo = computed(() => ({
  name: currentUser.value?.name ?? 'Pegawai',
  role: currentUser.value?.role ?? 'pegawai',
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
