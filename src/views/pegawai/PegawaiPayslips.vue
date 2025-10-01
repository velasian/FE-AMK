<script setup>
import { computed, ref } from 'vue'

const years = [2024, 2023, 2022]
const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const selectedYear = ref(years[0])
const selectedMonth = ref(months[new Date().getMonth()])

const payslipData = {
  2024: {
    Januari: { gajiPokok: 'Rp8.500.000', bonus: 'Rp1.200.000', potongan: 'Rp250.000' },
    Februari: { gajiPokok: 'Rp8.500.000', bonus: 'Rp900.000', potongan: 'Rp260.000' },
    Maret: { gajiPokok: 'Rp8.500.000', bonus: 'Rp1.000.000', potongan: 'Rp255.000' },
  },
  2023: {
    Desember: { gajiPokok: 'Rp8.200.000', bonus: 'Rp850.000', potongan: 'Rp240.000' },
  },
}

const activePayslip = computed(() => {
  const yearData = payslipData[selectedYear.value] || {}
  return yearData[selectedMonth.value] || null
})
</script>

<template>
  <section class="payslip">
    <article class="glass-card filter">
      <div>
        <h2>Slip Gaji</h2>
        <p class="subtitle">Pilih periode untuk melihat detail slip gaji Anda.</p>
      </div>
      <div class="selectors">
        <label>
          <span>Tahun</span>
          <select v-model="selectedYear">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </label>
        <label>
          <span>Bulan</span>
          <select v-model="selectedMonth">
            <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
          </select>
        </label>
      </div>
    </article>

    <article class="glass-card detail" v-if="activePayslip">
      <h3>Detail Komponen</h3>
      <ul>
        <li><span>Gaji Pokok</span><strong>{{ activePayslip.gajiPokok }}</strong></li>
        <li><span>Bonus</span><strong>{{ activePayslip.bonus }}</strong></li>
        <li><span>Potongan</span><strong>{{ activePayslip.potongan }}</strong></li>
      </ul>
      <footer>
        <p class="net-label">Take Home Pay</p>
        <p class="net-amount">Rp9.450.000</p>
      </footer>
    </article>

    <article class="glass-card empty" v-else>
      <h3>Slip gaji belum tersedia</h3>
      <p>Pilih periode lainnya untuk melihat riwayat slip gaji Anda.</p>
    </article>
  </section>
</template>

<style scoped>
.payslip {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: 1.6rem;
  color: #0b1330;
  box-shadow: 0 18px 40px rgba(4, 12, 32, 0.18);
  border: 1px solid rgba(15, 23, 42, 0.05);
}

.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
}

.filter h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #111e46;
}

.subtitle {
  margin: 0.4rem 0 0;
  color: rgba(15, 23, 42, 0.6);
}

.selectors {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 160px;
}

label span {
  font-weight: 600;
  font-size: 0.9rem;
}

select {
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.04);
  font-size: 0.95rem;
}

.detail h3,
.empty h3 {
  margin: 0 0 1.2rem;
  font-size: 1.1rem;
  color: #111e46;
}

.detail ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.detail span {
  color: rgba(15, 23, 42, 0.6);
}

.detail strong {
  color: #0f172a;
}

footer {
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.net-label {
  margin: 0;
  color: rgba(15, 23, 42, 0.6);
  font-weight: 600;
}

.net-amount {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
}

.empty p {
  margin: 0;
  color: rgba(15, 23, 42, 0.6);
}

@media (max-width: 640px) {
  .detail li {
    flex-direction: column;
    align-items: flex-start;
  }

  footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
