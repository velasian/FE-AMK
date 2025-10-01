<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <div class="brand-initial">AMK</div>
        <div>
          <h2>Officer Panel</h2>
          <p>Pantau aktivitas operasional dan tugas lapangan.</p>
        </div>
      </div>

      <nav class="sidebar__nav">
        <a class="nav-link" href="#ringkasan">Ringkasan</a>
        <a class="nav-link" href="#penugasan">Penugasan</a>
      </nav>

      <div class="sidebar__meta">
        <div class="user-role">
          <span class="label">Nama</span>
          <span class="value">{{ user.name }}</span>
        </div>
        <button class="logout" type="button" @click="logout">Keluar</button>
      </div>
    </aside>

    <main class="main-content">
      <header class="content-header" id="ringkasan">
        <div>
          <p class="greeting">{{ greeting }}</p>
          <h1>Dashboard Officer</h1>
          <p class="subtitle">
            Modul analitik officer akan segera hadir. Sementara itu, gunakan halaman ini untuk
            memantau catatan dan kebutuhan operasional terbaru.
          </p>
        </div>
        <div class="period">
          <span class="label">Status</span>
          <strong>Pengembangan</strong>
        </div>
      </header>

      <section class="panel placeholder">
        <header class="panel__header">
          <div>
            <h2>Segera Hadir</h2>
            <p>Fitur penugasan lapangan, monitoring SLA, dan pelaporan real-time akan ditambahkan di sini.</p>
          </div>
        </header>

        <div class="placeholder-grid">
          <article class="placeholder-card">
            <h3>Penugasan Harian</h3>
            <p>Kelola distribusi tugas dan pantau progres harian tim officer.</p>
          </article>
          <article class="placeholder-card">
            <h3>Monitoring Lokasi</h3>
            <p>Integrasi dengan pelacakan lokasi untuk memastikan kunjungan sesuai jadwal.</p>
          </article>
          <article class="placeholder-card">
            <h3>Catatan Lapangan</h3>
            <p>Kompilasi catatan lapangan, dokumentasi foto, dan kebutuhan follow-up.</p>
          </article>
        </div>

        <div class="info-box">
          <h3>Butuh fitur tertentu?</h3>
          <p>
            Sampaikan kebutuhan Anda kepada tim pengembang agar modul officer dapat disesuaikan dengan
            alur kerja harian.
          </p>
        </div>
      </section>

      <section class="panel" id="penugasan">
        <header class="panel__header">
          <div>
            <h2>Catatan Sementara</h2>
            <p>Belum ada data penugasan yang ditampilkan. Fitur ini akan tersedia dalam iterasi berikutnya.</p>
          </div>
        </header>

        <div class="empty">Konten belum tersedia.</div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const defaultUser = {
  name: 'Officer On Duty',
  email: 'officer@amk.test',
  role: 'officer'
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

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
})

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
  width: 260px;
  background: rgba(15, 23, 42, 0.85);
  border-right: 1px solid rgba(148, 163, 184, 0.25);
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.25rem, 2.5vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

.user-role .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.65);
}

.user-role .value {
  font-weight: 600;
  letter-spacing: 0.05em;
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
  background: rgba(248, 113, 113, 0.12);
  border-color: rgba(248, 113, 113, 0.4);
}

.main-content {
  flex: 1;
  padding: clamp(1.5rem, 4vw, 3rem);
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
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  color: #f8fafc;
}

.subtitle {
  max-width: 580px;
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

.panel {
  background: rgba(15, 23, 42, 0.65);
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  padding: clamp(1.5rem, 3vw, 2.25rem);
  display: grid;
  gap: 1.5rem;
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

.placeholder-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.placeholder-card {
  padding: 1.5rem;
  border-radius: 18px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.25);
  display: grid;
  gap: 0.5rem;
}

.placeholder-card h3 {
  margin: 0;
  color: #f8fafc;
}

.placeholder-card p {
  margin: 0;
  color: rgba(226, 232, 240, 0.75);
}

.info-box {
  padding: 1.25rem 1.5rem;
  border-radius: 18px;
  background: rgba(30, 64, 175, 0.3);
  border: 1px solid rgba(96, 165, 250, 0.4);
  display: grid;
  gap: 0.5rem;
}

.info-box h3 {
  margin: 0;
  color: #bfdbfe;
}

.info-box p {
  margin: 0;
  color: rgba(226, 232, 240, 0.85);
}

.empty {
  text-align: center;
  color: rgba(226, 232, 240, 0.6);
  padding: 2rem 0;
}

@media (max-width: 1080px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .sidebar__nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
}
</style>
