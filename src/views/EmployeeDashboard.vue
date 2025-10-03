<template>
  <DashboardLayout
    :user-name="userName"
    role="Pegawai"
    :menu-items="menuItems"
    :summary-cards="summaryCards"
    recent-title="Slip gaji terbaru"
    recent-subtitle="Riwayat slip gaji Anda selama 6 bulan terakhir."
    :recent-items="recentItems"
    :stats="stats"
    :quick-actions="quickActions"
    quick-actions-title="Butuh melakukan sesuatu?"
    accent-color="#1f3c88"
    greeting="Hai, berikut ringkasan gaji Anda!"
    @logout="handleLogout"
  />
</template>

<script setup>
import DashboardLayout from '../components/DashboardLayout.vue'
import { useRouter } from 'vue-router'
import { clearUserSession, getStoredUser } from '../utils/auth'

const menuItems = [
  { label: 'Beranda', helper: 'Ringkasan pribadi' },
  { label: 'Biodata', helper: 'Lengkapi informasi Anda' },
  { label: 'Slip Gaji', helper: 'Lihat riwayat slip' }
]

const summaryCards = [
  {
    title: 'Total slip diterima',
    value: '36 Slip',
    meta: 'Aktif sejak Jan 2021',
    icon: '📄',
    accent: '#4e7dff'
  },
  {
    title: 'Gaji terakhir',
    value: 'Rp 12.500.000',
    meta: 'Ditransfer 25 Maret 2024',
    icon: '💳',
    accent: '#5bc4bf'
  },
  {
    title: 'Tunjangan tersisa',
    value: 'Rp 1.250.000',
    meta: 'Klaim sebelum 30 April',
    icon: '🎁',
    accent: '#ffba5a'
  }
]

const recentItems = [
  {
    id: 1,
    name: 'Slip Maret 2024',
    description: 'Gaji pokok + lembur',
    amount: 'Rp 12.500.000',
    status: { label: 'Tersedia', tone: 'success' }
  },
  {
    id: 2,
    name: 'Slip Februari 2024',
    description: 'Gaji pokok',
    amount: 'Rp 12.000.000',
    status: { label: 'Diarsipkan', tone: 'neutral' }
  },
  {
    id: 3,
    name: 'Slip Januari 2024',
    description: 'Gaji pokok + bonus tahunan',
    amount: 'Rp 18.500.000',
    status: { label: 'Diarsipkan', tone: 'neutral' }
  }
]

const stats = {
  title: 'Ringkasan pendapatan',
  subtitle: 'Total pendapatan per tahun',
  period: 'Tahun 2024',
  total: '27%',
  totalLabel: 'Peningkatan dari tahun lalu',
  progress: 0.27,
  accent: '#4e7dff',
  items: [
    { label: 'Total pendapatan 2024', value: 'Rp 37.000.000' },
    { label: 'Lembur diterima', value: 'Rp 3.200.000' },
    { label: 'Bonus tahunan', value: 'Rp 6.500.000' }
  ],
  footer: 'Data diperbarui otomatis setiap bulan'
}

const quickActions = [
  {
    label: 'Perbarui biodata',
    description: 'Perbarui alamat, rekening, dan kontak darurat.'
  },
  {
    label: 'Unduh slip gaji',
    description: 'Pilih bulan dan unduh slip gaji Anda kapan saja.'
  }
]

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
</script>
