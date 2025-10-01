<script setup>
const summaryCards = [
  {
    title: 'Total Pegawai',
    value: '128 Orang',
    description: 'Naik 8% dari bulan lalu',
    accent: 'primary',
  },
  {
    title: 'Slip Gaji Terkirim',
    value: '124 Slip',
    description: '97% pegawai telah menerima',
    accent: 'teal',
  },
  {
    title: 'Pengajuan Cuti',
    value: '18 Permintaan',
    description: '5 menunggu persetujuan',
    accent: 'purple',
  },
  {
    title: 'Dokumen Pending',
    value: '6 Dokumen',
    description: 'Perlu ditindaklanjuti hari ini',
    accent: 'amber',
  },
]

const performanceBars = [
  { label: 'Jan', payroll: 54, submissions: 46 },
  { label: 'Feb', payroll: 68, submissions: 52 },
  { label: 'Mar', payroll: 74, submissions: 60 },
  { label: 'Apr', payroll: 79, submissions: 64 },
  { label: 'Mei', payroll: 83, submissions: 68 },
  { label: 'Jun', payroll: 88, submissions: 72 },
  { label: 'Jul', payroll: 92, submissions: 78 },
]

const progressPrograms = [
  { label: 'Onboarding', percentage: 95, detail: 'Batch baru selesai pelatihan' },
  { label: 'Kepatuhan', percentage: 82, detail: 'Audit internal minggu ini' },
  { label: 'Benefit', percentage: 78, detail: 'Pendaftaran BPJS gelombang 3' },
  { label: 'Kinerja', percentage: 90, detail: 'Evaluasi Q2 diproses' },
]

const teamMembers = [
  { name: 'Mary Johnson', role: 'HR Business Partner' },
  { name: 'James Brown', role: 'Payroll Specialist' },
  { name: 'Ayu Kartika', role: 'Recruitment Lead' },
]

const calendarEvents = [
  { time: '09:30', title: 'Rapat slip gaji Juli', category: 'Penggajian' },
  { time: '11:00', title: 'Kick-off pelatihan compliance', category: 'Pelatihan' },
  { time: '15:00', title: 'Review KPI divisi Sales', category: 'Evaluasi' },
]

const upcomingItems = [
  {
    title: 'Pengumuman struktur organisasi',
    description: 'Bagikan update struktur baru ke seluruh pegawai.',
    date: '14 Juli 2023',
  },
  {
    title: 'Tutup pengajuan cuti Q3',
    description: 'Pastikan seluruh permintaan sudah disetujui.',
    date: '18 Juli 2023',
  },
  {
    title: 'Upload slip gaji Agustus',
    description: 'Siapkan template dan jadwalkan distribusi.',
    date: '1 Agustus 2023',
  },
]

function getProgressStyle(percentage) {
  const value = Math.max(0, Math.min(100, percentage))
  return {
    background: `conic-gradient(#3b82f6 ${value * 3.6}deg, rgba(148, 163, 184, 0.18) ${value * 3.6}deg)`
  }
}
</script>

<template>
  <section class="overview-grid">
    <div class="main-column">
      <div class="welcome-grid">
        <article class="glass-card welcome-card">
          <div class="welcome-content">
            <span class="tag">Dashboard HR</span>
            <h2>Halo, Admin!</h2>
            <p>
              Ada beberapa tugas penting hari ini. Lanjutkan pengiriman slip gaji, periksa pengajuan cuti,
              dan jaga agar tim tetap terinformasi.
            </p>
            <div class="welcome-actions">
              <button type="button" class="primary-action">Lihat laporan</button>
              <button type="button" class="ghost-action">Buat tugas</button>
            </div>
          </div>
          <div class="welcome-illustration">
            <div class="bubble bubble-lg"></div>
            <div class="bubble bubble-md"></div>
            <div class="desk"></div>
            <div class="laptop"></div>
            <div class="character"></div>
          </div>
        </article>

        <div class="summary-stack">
          <article
            v-for="card in summaryCards"
            :key="card.title"
            class="glass-card summary-card"
            :class="`summary-card--${card.accent}`"
          >
            <span class="summary-label">{{ card.title }}</span>
            <strong class="summary-value">{{ card.value }}</strong>
            <p class="summary-description">{{ card.description }}</p>
          </article>
        </div>
      </div>

      <div class="insight-grid">
        <article class="glass-card performance-card">
          <header>
            <div>
              <span class="tag">Performa</span>
              <h3>Performa Penggajian</h3>
            </div>
            <button type="button" class="ghost-action">Unduh laporan</button>
          </header>
          <p class="subtitle">Progress pembayaran dan pengajuan selama tujuh bulan terakhir.</p>
          <div class="chart-area">
            <div v-for="bar in performanceBars" :key="bar.label" class="chart-bar">
              <div class="bar payroll" :style="{ height: `${bar.payroll * 2}px` }"></div>
              <div class="bar submission" :style="{ height: `${bar.submissions * 2}px` }"></div>
              <span class="bar-label">{{ bar.label }}</span>
            </div>
          </div>
          <footer class="chart-legend">
            <span><span class="dot dot-primary"></span>Pembayaran selesai</span>
            <span><span class="dot dot-secondary"></span>Pengajuan diterima</span>
          </footer>
        </article>

        <article class="glass-card progress-card">
          <header>
            <div>
              <span class="tag">Monitoring</span>
              <h3>Program Berjalan</h3>
            </div>
            <button type="button" class="ghost-action">Lihat semua</button>
          </header>
          <div class="progress-grid">
            <div v-for="program in progressPrograms" :key="program.label" class="progress-item">
              <div class="progress-circle" :style="getProgressStyle(program.percentage)">
                <span>{{ program.percentage }}%</span>
              </div>
              <div class="progress-info">
                <h4>{{ program.label }}</h4>
                <p>{{ program.detail }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <article class="glass-card team-card">
        <header>
          <div>
            <span class="tag">Kolaborasi</span>
            <h3>Tim HR Terhubung</h3>
          </div>
          <button type="button" class="ghost-action">Tambah anggota</button>
        </header>
        <ul class="team-list">
          <li v-for="member in teamMembers" :key="member.name">
            <div class="avatar">{{ member.name.charAt(0) }}</div>
            <div>
              <p class="team-name">{{ member.name }}</p>
              <span class="team-role">{{ member.role }}</span>
            </div>
            <button type="button" class="link-button">Hubungi</button>
          </li>
        </ul>
      </article>
    </div>

    <aside class="side-column">
      <article class="glass-card calendar-card">
        <header>
          <div>
            <span class="tag">Agenda</span>
            <h3>Jadwal Hari Ini</h3>
          </div>
          <button type="button" class="ghost-action">Lihat kalender</button>
        </header>
        <ul class="calendar-list">
          <li v-for="event in calendarEvents" :key="event.title">
            <div class="event-time">{{ event.time }}</div>
            <div class="event-info">
              <p class="event-title">{{ event.title }}</p>
              <span class="event-category">{{ event.category }}</span>
            </div>
          </li>
        </ul>
      </article>

      <article class="glass-card upcoming-card">
        <header>
          <div>
            <span class="tag">Upcoming</span>
            <h3>Catatan Penting</h3>
          </div>
        </header>
        <ul class="upcoming-list">
          <li v-for="item in upcomingItems" :key="item.title">
            <div>
              <p class="upcoming-title">{{ item.title }}</p>
              <p class="upcoming-description">{{ item.description }}</p>
            </div>
            <span class="upcoming-date">{{ item.date }}</span>
          </li>
        </ul>
      </article>
    </aside>
  </section>
</template>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.4fr) minmax(260px, 0.9fr);
  gap: 2rem;
  align-items: start;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.welcome-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 1.5rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  padding: 1.8rem;
  color: #0b1330;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 22px 55px rgba(4, 12, 32, 0.16);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: rgba(37, 99, 235, 0.95);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.welcome-card {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.welcome-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), transparent 55%);
  z-index: -1;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.welcome-content h2 {
  margin: 0;
  font-size: 1.85rem;
  color: #111e46;
}

.welcome-content p {
  margin: 0;
  color: rgba(15, 23, 42, 0.68);
  line-height: 1.6;
}

.welcome-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.primary-action,
.ghost-action {
  border-radius: 14px;
  padding: 0.65rem 1.3rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-action {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(99, 102, 241, 0.85));
  color: #f5f7ff;
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.35);
}

.primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 32px rgba(59, 130, 246, 0.45);
}

.ghost-action {
  background: rgba(59, 130, 246, 0.12);
  color: rgba(37, 99, 235, 0.95);
  border: 1px solid rgba(37, 99, 235, 0.15);
}

.ghost-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(148, 163, 255, 0.25);
}

.welcome-illustration {
  position: relative;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.18);
  filter: blur(0);
}

.bubble-lg {
  width: 180px;
  height: 180px;
  top: 10%;
  right: 14%;
}

.bubble-md {
  width: 120px;
  height: 120px;
  bottom: 12%;
  left: 18%;
  background: rgba(129, 140, 248, 0.22);
}

.desk {
  position: absolute;
  bottom: 12%;
  width: 180px;
  height: 16px;
  background: linear-gradient(90deg, rgba(148, 163, 255, 0.55), rgba(96, 165, 250, 0.55));
  border-radius: 999px;
}

.laptop {
  position: absolute;
  bottom: 18%;
  width: 120px;
  height: 70px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(14, 165, 233, 0.7));
  box-shadow: 0 12px 25px rgba(59, 130, 246, 0.35);
}

.character {
  position: absolute;
  bottom: 32%;
  width: 70px;
  height: 70px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(240, 171, 252, 0.75), rgba(14, 165, 233, 0.6));
  box-shadow: 0 18px 25px rgba(37, 99, 235, 0.35);
}

.summary-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.1rem;
}

.summary-card {
  gap: 0.85rem;
}

.summary-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(30, 41, 59, 0.65);
}

.summary-value {
  font-size: 1.75rem;
  color: #0f172a;
}

.summary-description {
  margin: 0;
  color: rgba(30, 41, 59, 0.6);
}

.summary-card--primary {
  border-top: 4px solid rgba(59, 130, 246, 0.7);
}

.summary-card--teal {
  border-top: 4px solid rgba(13, 148, 136, 0.65);
}

.summary-card--purple {
  border-top: 4px solid rgba(168, 85, 247, 0.7);
}

.summary-card--amber {
  border-top: 4px solid rgba(251, 191, 36, 0.7);
}

.insight-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 1.5rem;
}

.performance-card header,
.progress-card header,
.team-card header,
.calendar-card header,
.upcoming-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.performance-card h3,
.progress-card h3,
.team-card h3,
.calendar-card h3,
.upcoming-card h3 {
  margin: 0.35rem 0 0;
  color: #111e46;
  font-size: 1.15rem;
}

.subtitle {
  margin: 0;
  color: rgba(30, 41, 59, 0.6);
}

.chart-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
  gap: 1rem;
  align-items: end;
  height: 220px;
}

.chart-bar {
  display: grid;
  grid-template-rows: 1fr 1fr auto;
  gap: 0.35rem;
  justify-items: center;
}

.bar {
  width: 14px;
  border-radius: 12px;
}

.bar.payroll {
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.9), rgba(14, 116, 144, 0.75));
}

.bar.submission {
  background: linear-gradient(180deg, rgba(168, 85, 247, 0.85), rgba(99, 102, 241, 0.75));
}

.bar-label {
  font-size: 0.75rem;
  color: rgba(51, 65, 85, 0.65);
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(51, 65, 85, 0.7);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.45rem;
}

.dot-primary {
  background: rgba(59, 130, 246, 0.9);
}

.dot-secondary {
  background: rgba(168, 85, 247, 0.85);
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.progress-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.progress-circle {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
}

.progress-circle::after {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: #fff;
}

.progress-circle span {
  position: relative;
  font-weight: 700;
  color: #111e46;
}

.progress-info h4 {
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
}

.progress-info p {
  margin: 0.35rem 0 0;
  color: rgba(30, 41, 59, 0.6);
  font-size: 0.9rem;
}

.team-list,
.calendar-list,
.upcoming-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.team-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(129, 140, 248, 0.75));
  display: grid;
  place-items: center;
  color: #f5f7ff;
  font-weight: 700;
}

.team-name {
  margin: 0;
  font-weight: 600;
  color: #111e46;
}

.team-role {
  font-size: 0.85rem;
  color: rgba(30, 41, 59, 0.6);
}

.link-button {
  margin-left: auto;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: none;
  background: rgba(226, 232, 255, 0.9);
  color: rgba(37, 99, 235, 0.9);
  font-weight: 600;
  cursor: pointer;
}

.calendar-list li {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 1rem;
  align-items: center;
}

.event-time {
  font-weight: 700;
  color: #111e46;
}

.event-title {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
}

.event-category {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(51, 65, 85, 0.6);
}

.upcoming-list li {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  padding-bottom: 0.9rem;
}

.upcoming-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.upcoming-title {
  margin: 0;
  font-weight: 600;
  color: #111e46;
}

.upcoming-description {
  margin: 0;
  color: rgba(51, 65, 85, 0.65);
  font-size: 0.9rem;
}

.upcoming-date {
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(226, 232, 255, 0.9);
  color: rgba(37, 99, 235, 0.85);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 1200px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .side-column > * {
    flex: 1 1 280px;
  }
}

@media (max-width: 992px) {
  .welcome-grid,
  .insight-grid {
    grid-template-columns: 1fr;
  }

  .welcome-illustration {
    min-height: 180px;
  }

  .chart-area {
    height: 200px;
  }
}

@media (max-width: 640px) {
  .glass-card {
    padding: 1.4rem;
  }

  .summary-value {
    font-size: 1.5rem;
  }

  .chart-area {
    gap: 0.75rem;
  }

  .chart-bar {
    grid-template-rows: 1fr 1fr auto;
  }

  .progress-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    flex-direction: column;
  }
}
</style>
