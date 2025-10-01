<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <div class="brand-initial">AMK</div>
        <div>
          <h2>Admin Center</h2>
          <p>Kelola seluruh aktivitas perusahaan.</p>
        </div>
      </div>

      <nav class="sidebar__nav">
        <a class="nav-link" href="#dashboard">Dashboard</a>
        <a class="nav-link" href="#pegawai">Pegawai</a>
        <a class="nav-link" href="#slip-gaji">Slip Gaji</a>
      </nav>

      <div class="sidebar__meta">
        <div class="user-role">
          <span class="label">Peran</span>
          <span class="value">{{ user.role?.toUpperCase() || 'ADMIN' }}</span>
        </div>
        <button class="logout" type="button" @click="logout">Keluar</button>
      </div>
    </aside>

    <main class="main-content">
      <header class="content-header" id="dashboard">
        <div>
          <p class="greeting">{{ greeting }}</p>
          <h1>Dashboard Admin</h1>
          <p class="subtitle">
            Selamat datang, {{ user.name }}. Berikut ringkasan kinerja untuk periode
            {{ reportingPeriod }}.
          </p>
        </div>
        <div class="period">
          <span class="label">Periode Laporan</span>
          <strong>{{ reportingPeriod }}</strong>
        </div>
      </header>

      <section class="summary-grid">
        <article v-for="card in summaryCards" :key="card.title" class="summary-card">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value">{{ formatNumber(card.value) }}</div>
          <div class="card-caption">{{ card.caption }}</div>
          <div class="card-highlight">{{ card.highlight }}</div>
        </article>
      </section>

      <section id="pegawai" class="panel">
        <header class="panel__header">
          <div>
            <h2>Data Pegawai</h2>
            <p>Kelola dan pantau data pegawai secara cepat dan akurat.</p>
          </div>
          <div class="panel__meta">{{ filteredEmployees.length }} dari {{ employees.length }} pegawai</div>
        </header>

        <div class="search-bar">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Cari nama, divisi, atau jabatan..."
            aria-label="Cari pegawai"
          />
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Divisi</th>
                <th>Jabatan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filteredEmployees" :key="employee.id">
                <td>
                  <div class="cell-primary">{{ employee.name }}</div>
                  <div class="cell-secondary">{{ employee.id }}</div>
                </td>
                <td>{{ employee.department }}</td>
                <td>{{ employee.position }}</td>
                <td>
                  <span class="status" :class="employee.status.toLowerCase()">{{ employee.status }}</span>
                </td>
              </tr>
              <tr v-if="!filteredEmployees.length">
                <td class="empty" colspan="4">Pegawai tidak ditemukan untuk kata kunci tersebut.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="slip-gaji" class="panel">
        <header class="panel__header">
          <div>
            <h2>Status Slip Gaji</h2>
            <p>Monitor proses distribusi slip gaji untuk memastikan seluruh pegawai menerima tepat waktu.</p>
          </div>
          <div class="panel__meta">Terakhir diperbarui {{ lastBatch }}</div>
        </header>

        <div class="slip-grid">
          <div class="slip-progress">
            <div class="progress-ring">
              <svg viewBox="0 0 120 120">
                <circle class="track" cx="60" cy="60" r="54" />
                <circle
                  class="indicator"
                  cx="60"
                  cy="60"
                  r="54"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - (circumference * slipCompletion) / 100"
                />
              </svg>
              <div class="progress-value">
                <strong>{{ slipCompletion }}%</strong>
                <span>Terkirim</span>
              </div>
            </div>
            <p class="progress-caption">
              {{ formatNumber(salaryStats.sent) }} dari {{ formatNumber(totalSlips) }} slip gaji telah
              berhasil dikirimkan.
            </p>
          </div>

          <ul class="slip-list">
            <li v-for="stat in slipBreakdown" :key="stat.label">
              <div class="dot" :style="{ backgroundColor: stat.color }"></div>
              <div>
                <div class="label">{{ stat.label }}</div>
                <div class="value">{{ formatNumber(stat.value) }} slip</div>
                <small>{{ stat.description }}</small>
              </div>
              <span class="percentage">{{ stat.percentage }}%</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const defaultUser = {
  name: 'Administrator',
  email: 'admin@amk.test',
  role: 'admin'
}

const user = ref(defaultUser)

if (typeof window !== 'undefined') {
  const raw = window.localStorage.getItem('authUser')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      user.value = { ...defaultUser, ...parsed }
    } catch (error) {
      user.value = defaultUser
    }
  }
}

const employees = ref([
  { id: 'AMK-001', name: 'Rina Pratama', department: 'Keuangan', position: 'Finance Analyst', status: 'Aktif' },
  { id: 'AMK-002', name: 'Budi Santosa', department: 'Operasional', position: 'Supervisor Operasional', status: 'Aktif' },
  { id: 'AMK-003', name: 'Siti Rahmawati', department: 'Human Capital', position: 'HR Specialist', status: 'Cuti' },
  { id: 'AMK-004', name: 'Andi Wijaya', department: 'Teknologi', position: 'Software Engineer', status: 'Aktif' },
  { id: 'AMK-005', name: 'Maria Jelita', department: 'Pemasaran', position: 'Brand Strategist', status: 'Aktif' },
  { id: 'AMK-006', name: 'Fajar Nugraha', department: 'Operasional', position: 'Field Officer', status: 'Mutasi' }
])

const salaryStats = ref({
  sent: 128,
  pending: 5,
  issues: 2,
  lastBatch: '2025-01-20T09:00:00+07:00'
})

const searchTerm = ref('')

const filteredEmployees = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  if (!keyword) {
    return employees.value
  }

  return employees.value.filter((employee) => {
    const haystack = `${employee.name} ${employee.department} ${employee.position}`.toLowerCase()
    return haystack.includes(keyword)
  })
})

const reportingPeriod = computed(() =>
  new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date())
)

const currentMonthName = computed(() =>
  new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date())
)

const summaryCards = computed(() => [
  {
    title: 'Pegawai Terdaftar',
    value: employees.value.length,
    caption: `Aktif per ${reportingPeriod.value}`,
    highlight: 'Naik 4 pegawai dibanding bulan lalu'
  },
  {
    title: 'Slip Gaji Terkirim',
    value: salaryStats.value.sent,
    caption: `Periode ${reportingPeriod.value}`,
    highlight: '98% dari target distribusi'
  },
  {
    title: 'Slip Gaji Menunggu',
    value: salaryStats.value.pending,
    caption: 'Perlu tindak lanjut tim HR',
    highlight: `Selesaikan sebelum 25 ${currentMonthName.value}`
  },
  {
    title: 'Slip Perlu Koreksi',
    value: salaryStats.value.issues,
    caption: 'Butuh verifikasi ulang',
    highlight: 'Prioritaskan penanganan segera'
  }
])

const totalSlips = computed(() =>
  salaryStats.value.sent + salaryStats.value.pending + salaryStats.value.issues
)

const slipBreakdown = computed(() => {
  const total = totalSlips.value || 1
  return [
    {
      label: 'Slip Gaji Terkirim',
      value: salaryStats.value.sent,
      color: '#34d399',
      percentage: Math.round((salaryStats.value.sent / total) * 100),
      description: 'Sudah diterima seluruh pegawai'
    },
    {
      label: 'Menunggu Persetujuan',
      value: salaryStats.value.pending,
      color: '#fbbf24',
      percentage: Math.round((salaryStats.value.pending / total) * 100),
      description: 'Dalam proses verifikasi'
    },
    {
      label: 'Perlu Koreksi',
      value: salaryStats.value.issues,
      color: '#f87171',
      percentage: Math.round((salaryStats.value.issues / total) * 100),
      description: 'Menunggu revisi slip'
    }
  ]
})

const circumference = 2 * Math.PI * 54

const slipCompletion = computed(() => Math.round((salaryStats.value.sent / (totalSlips.value || 1)) * 100))

const lastBatch = computed(() =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(salaryStats.value.lastBatch))
)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
})

const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value)

const logout = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('authUser')
  }
  router.push({ name: 'login' })
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  color: #e2e8f0;
}

.sidebar {
  width: 280px;
  background: rgba(15, 23, 42, 0.85);
  border-right: 1px solid rgba(148, 163, 184, 0.25);
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.25rem, 2.5vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: sticky;
  top: 0;
  max-height: 100vh;
}

.sidebar__brand {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.brand-initial {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  color: #0f172a;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.sidebar__brand h2 {
  margin: 0;
  font-size: 1.15rem;
  color: #f8fafc;
}

.sidebar__brand p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(226, 232, 240, 0.7);
}

.sidebar__nav {
  display: grid;
  gap: 0.75rem;
}

.nav-link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.45);
  color: #e2e8f0;
  text-decoration: none;
  border: 1px solid transparent;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.nav-link:hover {
  border-color: rgba(96, 165, 250, 0.45);
  background: rgba(37, 99, 235, 0.3);
}

.sidebar__meta {
  margin-top: auto;
  display: grid;
  gap: 1rem;
}

.user-role {
  display: grid;
  gap: 0.25rem;
}

.user-role .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.65);
}

.user-role .value {
  font-weight: 600;
  letter-spacing: 0.08em;
}

.logout {
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.6);
  color: #fca5a5;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.logout:hover {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.4);
}

.main-content {
  flex: 1;
  padding: clamp(1.5rem, 4vw, 3.5rem);
  display: grid;
  gap: clamp(1.75rem, 3vw, 2.5rem);
}

.content-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.greeting {
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.75);
}

.content-header h1 {
  margin: 0.25rem 0;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  color: #f8fafc;
}

.subtitle {
  max-width: 560px;
  color: rgba(226, 232, 240, 0.75);
}

.period {
  padding: 1rem;
  background: rgba(30, 41, 59, 0.45);
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  text-align: right;
  display: grid;
  gap: 0.35rem;
}

.period .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(226, 232, 240, 0.6);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.summary-card {
  padding: 1.5rem;
  border-radius: 18px;
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.25);
  display: grid;
  gap: 0.5rem;
  min-height: 160px;
}

.card-title {
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-value {
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  font-weight: 700;
  color: #f8fafc;
}

.card-caption {
  color: rgba(226, 232, 240, 0.7);
}

.card-highlight {
  font-size: 0.9rem;
  color: #93c5fd;
}

.panel {
  background: rgba(15, 23, 42, 0.65);
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  padding: clamp(1.5rem, 3vw, 2.25rem);
  display: grid;
  gap: 1.5rem;
}

.panel__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.panel__header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #f8fafc;
}

.panel__header p {
  margin: 0.35rem 0 0;
  color: rgba(226, 232, 240, 0.7);
  max-width: 560px;
}

.panel__meta {
  padding: 0.6rem 1rem;
  background: rgba(30, 41, 59, 0.55);
  border-radius: 999px;
  font-size: 0.85rem;
}

.search-bar input {
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.4);
  color: #f8fafc;
  padding: 0 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
}

th,
td {
  padding: 0.9rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(226, 232, 240, 0.7);
}

.cell-primary {
  font-weight: 600;
}

.cell-secondary {
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.6);
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 96px;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
}

.status.cuti {
  background: rgba(250, 204, 21, 0.15);
  border-color: rgba(250, 204, 21, 0.45);
  color: #fde68a;
}

.status.mutasi {
  background: rgba(248, 113, 113, 0.15);
  border-color: rgba(248, 113, 113, 0.4);
  color: #fecaca;
}

.empty {
  text-align: center;
  color: rgba(226, 232, 240, 0.6);
}

.slip-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(220px, 280px) 1fr;
}

.slip-progress {
  display: grid;
  gap: 1rem;
}

.progress-ring {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto;
}

.progress-ring svg {
  width: 140px;
  height: 140px;
}

.track {
  fill: none;
  stroke: rgba(148, 163, 184, 0.25);
  stroke-width: 12;
}

.indicator {
  fill: none;
  stroke: url(#progressGradient);
  stroke: #38bdf8;
  stroke-width: 12;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.4s ease;
}

.progress-value {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 0.25rem;
}

.progress-value strong {
  font-size: 1.8rem;
  color: #f8fafc;
}

.progress-value span {
  font-size: 0.85rem;
  color: rgba(226, 232, 240, 0.7);
}

.progress-caption {
  text-align: center;
  color: rgba(226, 232, 240, 0.75);
  font-size: 0.9rem;
}

.slip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
}

.slip-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.slip-list .label {
  font-weight: 600;
}

.slip-list .value {
  color: rgba(226, 232, 240, 0.8);
}

.percentage {
  font-weight: 600;
  color: #93c5fd;
}

@media (max-width: 1080px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: relative;
    max-height: none;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .sidebar__nav {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
  }

  .nav-link {
    text-align: center;
  }

  .sidebar__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

@media (max-width: 960px) {
  .slip-grid {
    grid-template-columns: 1fr;
  }

  .progress-caption {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .sidebar {
    flex-direction: column;
    align-items: stretch;
  }

  .sidebar__nav {
    grid-template-columns: 1fr;
  }

  .sidebar__meta {
    flex-direction: column;
    align-items: stretch;
  }

  .panel__header {
    flex-direction: column;
  }

  table {
    min-width: 100%;
  }
}
</style>
