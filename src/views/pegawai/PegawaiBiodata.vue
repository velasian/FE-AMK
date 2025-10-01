<script setup>
const biodata = {
  name: 'Pegawai Andalan',
  employeeId: 'EMP-2043',
  position: 'Senior Finance Analyst',
  division: 'Keuangan',
  joinDate: '12 Januari 2019',
  phone: '+62 812-3456-7890',
  email: 'pegawai@amk-portal.test',
  address: 'Jl. Melati No. 12, Jakarta Selatan',
}
</script>

<template>
  <section class="biodata">
    <article class="glass-card profile">
      <div class="avatar">{{ biodata.name.charAt(0) }}</div>
      <div>
        <h2>{{ biodata.name }}</h2>
        <p class="id">ID Pegawai: {{ biodata.employeeId }}</p>
      </div>
    </article>

    <div class="grid info-grid">
      <article class="glass-card info">
        <h3>Informasi Pekerjaan</h3>
        <ul>
          <li><span>Jabatan</span><strong>{{ biodata.position }}</strong></li>
          <li><span>Divisi</span><strong>{{ biodata.division }}</strong></li>
          <li><span>Tanggal Bergabung</span><strong>{{ biodata.joinDate }}</strong></li>
        </ul>
      </article>

      <article class="glass-card info">
        <h3>Kontak</h3>
        <ul>
          <li><span>Email</span><strong>{{ biodata.email }}</strong></li>
          <li><span>No. Telepon</span><strong>{{ biodata.phone }}</strong></li>
          <li><span>Alamat</span><strong>{{ biodata.address }}</strong></li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.biodata {
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

.profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.85), rgba(139, 92, 246, 0.85));
  display: grid;
  place-items: center;
  font-size: 2rem;
  font-weight: 700;
  color: #f5f7ff;
}

.profile h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #111e46;
}

.id {
  margin: 0.4rem 0 0;
  color: rgba(15, 23, 42, 0.65);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.info h3 {
  margin: 0 0 1.2rem;
  font-size: 1.1rem;
  color: #111e46;
}

.info ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.info span {
  color: rgba(15, 23, 42, 0.6);
}

.info strong {
  color: #0f172a;
}

@media (max-width: 640px) {
  .profile {
    flex-direction: column;
    align-items: flex-start;
  }

  .info li {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
