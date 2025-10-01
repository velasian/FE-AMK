<script setup>
const payslipSummary = [
  { title: 'Slip gaji Januari', status: 'Terkirim', count: 125 },
  { title: 'Slip gaji Februari', status: 'Proses', count: 12 },
  { title: 'Slip gaji Maret', status: 'Dijadwalkan', count: 128 },
]
</script>

<template>
  <section class="payslips">
    <div class="glass-card hero">
      <div>
        <h2>Status Distribusi Slip Gaji</h2>
        <p class="subtitle">Ringkasan progres pengiriman slip gaji karyawan.</p>
      </div>
      <div class="stats">
        <div class="stat">
          <p class="label">Slip terkirim bulan ini</p>
          <p class="value">124</p>
        </div>
        <div class="stat">
          <p class="label">Menunggu validasi</p>
          <p class="value">4</p>
        </div>
        <div class="stat">
          <p class="label">Ditolak</p>
          <p class="value">0</p>
        </div>
      </div>
    </div>

    <div class="glass-card list">
      <h3>Riwayat Pengiriman</h3>
      <ul>
        <li v-for="item in payslipSummary" :key="item.title">
          <div>
            <p class="title">{{ item.title }}</p>
            <p class="status">Status: {{ item.status }}</p>
          </div>
          <span class="count">{{ item.count }} Pegawai</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.payslips {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: 1.8rem;
  color: #0b1330;
  box-shadow: 0 18px 40px rgba(4, 12, 32, 0.18);
  border: 1px solid rgba(15, 23, 42, 0.05);
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.hero h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #111e46;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: rgba(15, 23, 42, 0.6);
  font-size: 0.95rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.25rem;
}

.stat {
  background: rgba(59, 130, 246, 0.12);
  border-radius: 18px;
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stat:nth-child(2) {
  background: rgba(234, 179, 8, 0.12);
}

.stat:nth-child(3) {
  background: rgba(96, 165, 250, 0.12);
}

.label {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.value {
  margin: 0;
  font-size: 1.7rem;
  font-weight: 700;
  color: #0f172a;
}

.list h3 {
  margin: 0 0 1.25rem;
  font-size: 1.1rem;
  color: #111e46;
}

.list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.title {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
}

.status {
  margin: 0.4rem 0 0;
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.6);
}

.count {
  font-weight: 600;
  background: rgba(37, 99, 235, 0.12);
  color: rgba(37, 99, 235, 0.95);
  border-radius: 14px;
  padding: 0.45rem 1rem;
}

@media (max-width: 640px) {
  .glass-card {
    padding: 1.4rem;
  }

  .list li {
    flex-direction: column;
    align-items: flex-start;
  }

  .count {
    align-self: flex-end;
  }
}
</style>
