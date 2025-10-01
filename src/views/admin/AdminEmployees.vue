<script setup>
import { computed, ref } from 'vue'

const searchTerm = ref('')

const employees = [
  { name: 'Aulia Rahma', position: 'Finance Specialist', status: 'Aktif', division: 'Keuangan' },
  { name: 'Bagas Pratama', position: 'HR Generalist', status: 'Cuti', division: 'Human Capital' },
  { name: 'Citra Widya', position: 'IT Support', status: 'Aktif', division: 'Teknologi' },
  { name: 'Dimas Saputra', position: 'Data Analyst', status: 'Aktif', division: 'Business Intelligence' },
  { name: 'Eka Laras', position: 'Marketing Officer', status: 'Aktif', division: 'Pemasaran' },
]

const filteredEmployees = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  if (!keyword) {
    return employees
  }
  return employees.filter((employee) =>
    [employee.name, employee.position, employee.division]
      .join(' ')
      .toLowerCase()
      .includes(keyword),
  )
})
</script>

<template>
  <section class="employees">
    <div class="toolbar glass-card">
      <div>
        <h2>Data Pegawai</h2>
        <p class="subtitle">Gunakan pencarian untuk mempercepat pencarian pegawai.</p>
      </div>
      <label class="search-field">
        <span>Cari pegawai</span>
        <input v-model="searchTerm" type="search" placeholder="Ketik nama atau divisi" />
      </label>
    </div>

    <div class="glass-card table-card">
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Posisi</th>
            <th>Divisi</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees" :key="employee.name">
            <td>
              <p class="name">{{ employee.name }}</p>
            </td>
            <td>{{ employee.position }}</td>
            <td>{{ employee.division }}</td>
            <td>
              <span class="status" :class="{ active: employee.status === 'Aktif' }">{{ employee.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.employees {
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

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: center;
}

.toolbar h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #111e46;
}

.subtitle {
  margin: 0.4rem 0 0;
  color: rgba(15, 23, 42, 0.6);
  font-size: 0.95rem;
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 220px;
}

.search-field span {
  font-weight: 600;
  font-size: 0.9rem;
}

.search-field input {
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  background: rgba(15, 23, 42, 0.04);
  color: #0b1330;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.search-field input:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.7);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.table-card {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th,
td {
  text-align: left;
  padding: 1rem 1rem 1rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(15, 23, 42, 0.65);
}

.name {
  margin: 0;
  font-weight: 600;
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.12);
  color: rgba(185, 28, 28, 0.85);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.status.active {
  background: rgba(59, 130, 246, 0.12);
  color: rgba(37, 99, 235, 0.95);
}

@media (max-width: 768px) {
  .toolbar {
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .glass-card {
    padding: 1.2rem;
  }

  table {
    min-width: 480px;
  }
}
</style>
