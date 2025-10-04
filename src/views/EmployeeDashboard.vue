<template>
  <DashboardLayout
    :user-name="userName"
    role="Pegawai"
    :menu-items="menuItems"
    :summary-cards="summaryCards"
    :recent-title="recentTitle"
    :recent-subtitle="recentSubtitle"
    :recent-items="recentItems"
    :stats="stats"
    :quick-actions="quickActions"
    quick-actions-title="Butuh melakukan sesuatu?"
    accent-color="#1f3c88"
    greeting="Hai, berikut ringkasan biodata Anda!"
    overview-key="overview"
    v-model:active-menu-key="activeMenu"
    @logout="handleLogout"
  >
    <template #biodata>
      <EmployeeProfilePanel :email="sessionUser?.email || ''" />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import DashboardLayout from '../components/DashboardLayout.vue'
import EmployeeProfilePanel from '../components/EmployeeProfilePanel.vue'
import { clearUserSession, getStoredUser } from '../utils/auth'
import { useEmployeeStore } from '../utils/employeeStore'

const router = useRouter()

const sessionUser = getStoredUser()

if (!sessionUser || sessionUser.role !== 'pegawai') {
  router.replace({ name: 'login' })
}

const userName = sessionUser?.name ?? 'Anisa Putri'

const handleLogout = () => {
  clearUserSession()
  router.push('/login')
}

const activeMenu = ref('overview')

const menuItems = [
  { key: 'overview', label: 'Beranda', helper: 'Ringkasan biodata' },
  { key: 'biodata', label: 'Biodata', helper: 'Perbarui informasi Anda' }
]

const { customFields, getEmployeeByEmail } = useEmployeeStore()

const completionKeys = ['phone', 'address', 'bankName', 'bankAccount', 'emergencyContactName', 'emergencyContactPhone']
const fieldLabels = {
  phone: 'Nomor Telepon',
  address: 'Alamat Domisili',
  bankName: 'Nama Bank',
  bankAccount: 'Nomor Rekening',
  emergencyContactName: 'Nama Kontak Darurat',
  emergencyContactPhone: 'Nomor Kontak Darurat'
}

const employeeRecord = computed(() => {
  if (!sessionUser?.email) return null
  return getEmployeeByEmail(sessionUser.email) || null
})

const completion = computed(() => {
  if (!employeeRecord.value) return 0
  const totalFields = completionKeys.length + customFields.value.length
  if (!totalFields) return 1
  let filled = 0
  completionKeys.forEach((key) => {
    if (employeeRecord.value?.[key]) filled += 1
  })
  customFields.value.forEach((field) => {
    if (employeeRecord.value?.customValues?.[field.key]) filled += 1
  })
  return Math.min(filled / totalFields, 1)
})

const summaryCards = computed(() => {
  const employee = employeeRecord.value
  return [
    {
      title: 'Nomor Pegawai',
      value: employee?.employeeNumber || '—',
      meta: employee?.department || 'Belum ada departemen',
      icon: '🆔',
      accent: '#4e7dff'
    },
    {
      title: 'Kelengkapan Biodata',
      value: `${Math.round(completion.value * 100)}%`,
      meta: completion.value === 1 ? 'Semua informasi telah lengkap' : 'Masih ada data yang perlu diisi',
      icon: '📋',
      accent: '#5bc4bf'
    },
    {
      title: 'Kontak Darurat',
      value: employee?.emergencyContactName || 'Belum diisi',
      meta: employee?.emergencyContactPhone || 'Isi kontak untuk keadaan darurat',
      icon: '☎️',
      accent: '#ffba5a'
    }
  ]
})

const pendingFields = computed(() => {
  if (!employeeRecord.value) return []
  const missing = []
  completionKeys.forEach((key) => {
    if (!employeeRecord.value?.[key]) {
      missing.push(fieldLabels[key])
    }
  })
  customFields.value.forEach((field) => {
    if (!employeeRecord.value?.customValues?.[field.key]) {
      missing.push(field.label)
    }
  })
  return missing.slice(0, 3)
})

const recentItems = computed(() => {
  if (!employeeRecord.value) return []
  const highlights = [
    {
      label: 'Alamat Domisili',
      value: employeeRecord.value.address,
      helper: 'Pastikan alamat sesuai untuk pengiriman dokumen'
    },
    {
      label: 'Rekening Bank',
      value: employeeRecord.value.bankAccount,
      helper: 'Digunakan untuk pencairan gaji'
    },
    {
      label: 'Sertifikasi',
      value: customFields.value.length
        ? employeeRecord.value.customValues?.[customFields.value[0].key]
        : null,
      helper: customFields.value.length ? customFields.value[0].label : 'Belum ada field tambahan'
    }
  ]

  return highlights.map((item, index) => ({
    id: index,
    name: item.label,
    description: item.helper,
    amount: item.value
      ? 'Terisi'
      : item.helper === 'Belum ada field tambahan'
        ? 'Tidak diperlukan'
        : 'Belum diisi',
    status: item.value
      ? { label: 'Lengkap', tone: 'success' }
      : item.helper === 'Belum ada field tambahan'
        ? { label: 'Tidak diperlukan', tone: 'neutral' }
        : { label: 'Perlu diisi', tone: 'warning' }
  }))
})

const stats = computed(() => {
  const percent = Math.round(completion.value * 100)
  const missing = pendingFields.value
  const items = missing.length
    ? missing.map((label) => ({ label, value: 'Perlu diisi' }))
    : [{ label: 'Semua data', value: '✅ Lengkap' }]

  return {
    title: 'Status biodata',
    subtitle: 'Pastikan semua informasi wajib telah diisi',
    period: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    total: `${percent}%`,
    totalLabel: missing.length ? `${missing.length} field belum terisi` : 'Semua field telah lengkap',
    progress: completion.value,
    accent: '#4e7dff',
    items,
    footer: missing.length
      ? 'Lengkapi data yang masih kosong untuk mempercepat administrasi.'
      : 'Terima kasih! Semua biodata sudah lengkap.'
  }
})

const quickActions = computed(() => [
  {
    label: 'Perbarui biodata',
    description: 'Isi atau revisi informasi kontak Anda di panel biodata.'
  },
  {
    label: 'Cek field tambahan',
    description: 'Lengkapi field baru yang ditambahkan oleh tim HR.'
  }
])

const recentTitle = 'Sorotan biodata Anda'
const recentSubtitle = 'Pantau informasi penting yang perlu dijaga tetap mutakhir.'
</script>
