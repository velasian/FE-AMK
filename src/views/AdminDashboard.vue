<template>
  <DashboardLayout
    :user-name="userName"
    role="Administrator"
    :menu-items="menuItems"
    :summary-cards="summaryCards"
    :recent-title="recentTitle"
    :recent-subtitle="recentSubtitle"
    :recent-items="recentItems"
    :stats="stats"
    :quick-actions="quickActions"
    quick-actions-title="Aksi cepat untuk admin"
    accent-color="#1f3c88"
    greeting="Semangat mengelola tim hari ini!"
    overview-key="overview"
    v-model:active-menu-key="activeMenu"
    @logout="handleLogout"
  >
    <template #pegawai>
      <AdminEmployeeManager />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import DashboardLayout from '../components/DashboardLayout.vue'
import AdminEmployeeManager from '../components/AdminEmployeeManager.vue'
import { clearUserSession, getStoredUser } from '../utils/auth'
import { useEmployeeStore } from '../utils/employeeStore'

const router = useRouter()

const sessionUser = getStoredUser()

if (!sessionUser || sessionUser.role !== 'admin') {
  router.replace({ name: 'login' })
}

const userName = sessionUser?.name ?? 'Naufal Pratama'

const handleLogout = () => {
  clearUserSession()
  router.push('/login')
}

const activeMenu = ref('overview')

const menuItems = [
  { key: 'overview', label: 'Beranda', helper: 'Ringkasan data pegawai' },
  { key: 'pegawai', label: 'Data Pegawai', helper: 'Kelola biodata & akses' }
]

const { employees, customFields } = useEmployeeStore()

const completionKeys = ['phone', 'address', 'bankName', 'bankAccount', 'emergencyContactName', 'emergencyContactPhone']

const averageCompletion = computed(() => {
  if (!employees.value.length) return 0
  const totalFields = completionKeys.length + customFields.value.length
  if (!totalFields) return 1

  let filled = 0
  employees.value.forEach((employee) => {
    completionKeys.forEach((key) => {
      if (employee[key]) filled += 1
    })
    customFields.value.forEach((field) => {
      if (employee.customValues?.[field.key]) filled += 1
    })
  })

  return Math.min(filled / (totalFields * employees.value.length), 1)
})

const summaryCards = computed(() => [
  {
    title: 'Total Pegawai',
    value: `${employees.value.length} Pegawai`,
    meta: 'Seluruh data tersimpan lokal',
    icon: '👥',
    accent: '#4e7dff'
  },
  {
    title: 'Field Biodata',
    value: `${completionKeys.length + customFields.value.length} Field`,
    meta: `${customFields.value.length} field kustom aktif`,
    icon: '🗂️',
    accent: '#5bc4bf'
  },
  {
    title: 'Kelengkapan Rata-rata',
    value: `${Math.round(averageCompletion.value * 100)}%`,
    meta: 'Progress update oleh pegawai',
    icon: '✅',
    accent: '#ffba5a'
  }
])

const describeCompletion = (employee) => {
  const total = completionKeys.length + customFields.value.length
  if (!total) {
    return { label: 'Lengkap', tone: 'success', amount: '100%' }
  }
  let filled = 0
  completionKeys.forEach((key) => {
    if (employee[key]) filled += 1
  })
  customFields.value.forEach((field) => {
    if (employee.customValues?.[field.key]) filled += 1
  })
  const percent = Math.round((filled / total) * 100)
  if (percent === 100) {
    return { label: 'Lengkap', tone: 'success', amount: '100%' }
  }
  if (percent >= 60) {
    return { label: 'Hampir lengkap', tone: 'info', amount: `${percent}%` }
  }
  return { label: 'Perlu data', tone: 'warning', amount: `${percent}%` }
}

const recentItems = computed(() => {
  return [...employees.value]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 3)
    .map((employee) => {
      const status = describeCompletion(employee)
      return {
        id: employee.id,
        name: employee.name,
        description: `${employee.department} • Bergabung ${formatDate(employee.joinDate)}`,
        amount: status.amount,
        status
      }
    })
})

const departmentStats = computed(() => {
  const counts = new Map()
  employees.value.forEach((employee) => {
    const key = employee.department || 'Lainnya'
    counts.set(key, (counts.get(key) || 0) + 1)
  })
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, value]) => ({ label, value: `${value} pegawai` }))
})

const stats = computed(() => ({
  title: 'Ringkasan biodata',
  subtitle: 'Monitoring kelengkapan data pegawai',
  period: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
  total: `${Math.round(averageCompletion.value * 100)}%`,
  totalLabel: 'Rata-rata terisi',
  progress: averageCompletion.value,
  accent: '#4e7dff',
  items: departmentStats.value,
  footer: `Terakhir diperbarui ${new Date().toLocaleDateString('id-ID')}`
}))

const quickActions = computed(() => [
  {
    label: 'Tambah field biodata',
    description: 'Butuh informasi baru? Tambahkan field kustom dan terapkan ke semua pegawai.'
  },
  {
    label: 'Review kelengkapan',
    description: 'Pantau pegawai yang masih perlu melengkapi biodata mereka.'
  },
  {
    label: 'Perbarui kredensial',
    description: 'Kelola email dan kata sandi demo langsung dari daftar pegawai.'
  }
])

const recentTitle = 'Aktivitas data pegawai'
const recentSubtitle = 'Pegawai terbaru dan status kelengkapan biodata mereka.'

function formatDate(value) {
  if (!value) return '–'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
</script>
