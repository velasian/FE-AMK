<template>
  <DashboardLayout
    :user-name="userName"
    role="Administrator"
    :menu-items="menuItems"
    :summary-cards="summaryCards"
    recent-title="Aktivitas payroll"
    recent-subtitle="Aktivitas terbaru tim HR & payroll."
    :recent-items="recentItems"
    :stats="stats"
    :quick-actions="quickActions"
    quick-actions-title="Aksi cepat untuk admin"
    accent-color="#1f3c88"
    greeting="Semangat mengelola tim hari ini!"
    @logout="handleLogout"
  />
</template>

<script setup>
import DashboardLayout from '../components/DashboardLayout.vue'
import { useRouter } from 'vue-router'
import { clearUserSession, getStoredUser } from '../utils/auth'

const menuItems = [
  { label: 'Beranda', helper: 'Ringkasan hari ini' },
  { label: 'Pegawai', helper: 'Kelola data karyawan' },
  { label: 'Slip Gaji', helper: 'Kirim & arsipkan slip' }
]

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

const summaryCards = [
  {
    title: 'Total Pegawai',
    value: '128 Pegawai',
    meta: '+5 pegawai baru bulan ini',
    icon: '👥',
    accent: '#4e7dff'
  },
  {
    title: 'Slip gaji terkirim',
    value: '245 Slip',
    meta: '98% dari target bulan ini',
    icon: '💼',
    accent: '#5bc4bf'
  },
  {
    title: 'Pengajuan pending',
    value: '12 Tugas',
    meta: 'Perlu ditindak lanjuti',
    icon: '⏳',
    accent: '#ffba5a'
  }
]

const recentItems = [
  {
    id: 1,
    name: 'Distribusi Slip April 2024',
    description: 'Mengirimkan slip ke seluruh karyawan',
    amount: 'Selesai',
    status: { label: 'Terkirim', tone: 'success' }
  },
  {
    id: 2,
    name: 'Update data pegawai - Divisi Sales',
    description: '3 pegawai baru ditambahkan',
    amount: '+3 data',
    status: { label: 'Diproses', tone: 'info' }
  },
  {
    id: 3,
    name: 'Reminder slip gaji kontrak',
    description: '15 pegawai kontrak butuh follow-up',
    amount: '15 pegawai',
    status: { label: 'Perlu tindakan', tone: 'warning' }
  }
]

const stats = {
  title: 'Statistik penggajian',
  subtitle: 'Rekap payroll bulan ini',
  period: 'April 2024',
  total: '98%',
  totalLabel: 'Slip sudah terkirim',
  progress: 0.82,
  accent: '#4e7dff',
  items: [
    { label: 'Pegawai aktif', value: '128' },
    { label: 'Slip menunggu', value: '4' },
    { label: 'Slip bermasalah', value: '1' }
  ],
  footer: 'Diperbarui 10 menit yang lalu'
}

const quickActions = [
  {
    label: 'Kirim slip gaji massal',
    description: 'Kirim slip gaji ke seluruh karyawan dalam satu klik.'
  },
  {
    label: 'Tambah pegawai baru',
    description: 'Lengkapi data onboarding untuk karyawan baru.'
  },
  {
    label: 'Unduh laporan',
    description: 'Rekap penggajian bulanan siap diunduh.'
  }
]
</script>
