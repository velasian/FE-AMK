<template>
  <section class="profile-panel" v-if="employee">
    <header class="profile-panel__header">
      <div>
        <h2>Biodata Pegawai</h2>
        <p>Perbarui informasi kontak, rekening bank, dan field tambahan yang diminta perusahaan.</p>
      </div>
      <button type="button" class="button button--primary" @click="handleSubmit" :disabled="isSaving">
        {{ isSaving ? 'Menyimpan…' : 'Simpan perubahan' }}
      </button>
    </header>

    <div class="profile-panel__grid">
      <article class="profile-card">
        <h3>Informasi Tetap</h3>
        <dl>
          <div>
            <dt>Nomor Pegawai</dt>
            <dd>{{ employee.employeeNumber }}</dd>
          </div>
          <div>
            <dt>Nama Lengkap</dt>
            <dd>{{ employee.name }}</dd>
          </div>
          <div>
            <dt>Email Perusahaan</dt>
            <dd>{{ employee.email }}</dd>
          </div>
          <div>
            <dt>Kata Sandi Portal</dt>
            <dd class="profile-panel__password">{{ employee.password }}</dd>
          </div>
          <div>
            <dt>Departemen</dt>
            <dd>{{ employee.department }}</dd>
          </div>
          <div>
            <dt>Jabatan</dt>
            <dd>{{ employee.position }}</dd>
          </div>
          <div>
            <dt>Tanggal Bergabung</dt>
            <dd>{{ formatDate(employee.joinDate) }}</dd>
          </div>
        </dl>
      </article>

      <form class="profile-card" @submit.prevent="handleSubmit">
        <h3>Kontak & Rekening</h3>
        <div class="form-grid">
          <label class="form-field">
            <span>Nomor Telepon</span>
            <input v-model="formState.phone" type="tel" placeholder="0812-xxxx-xxxx" required />
          </label>
          <label class="form-field">
            <span>Alamat Domisili</span>
            <textarea v-model="formState.address" rows="3" placeholder="Tulis alamat lengkap" required></textarea>
          </label>
          <label class="form-field">
            <span>Nama Bank</span>
            <input v-model="formState.bankName" type="text" placeholder="Nama bank" />
          </label>
          <label class="form-field">
            <span>Nomor Rekening</span>
            <input v-model="formState.bankAccount" type="text" placeholder="Nomor rekening" />
          </label>
          <label class="form-field">
            <span>Nama Kontak Darurat</span>
            <input v-model="formState.emergencyContactName" type="text" placeholder="Nama lengkap" />
          </label>
          <label class="form-field">
            <span>Nomor Kontak Darurat</span>
            <input v-model="formState.emergencyContactPhone" type="tel" placeholder="0812-xxxx-xxxx" />
          </label>
        </div>
      </form>

      <form v-if="customFields.length" class="profile-card" @submit.prevent="handleSubmit">
        <h3>Field Tambahan</h3>
        <div class="form-grid">
          <label v-for="field in customFields" :key="field.id" class="form-field">
            <span>{{ field.label }}</span>
            <input v-model="customValues[field.key]" type="text" :placeholder="`Isi ${field.label.toLowerCase()}`" />
          </label>
        </div>
      </form>
    </div>

    <transition name="fade">
      <p v-if="feedback" class="profile-panel__feedback">{{ feedback }}</p>
    </transition>
  </section>

  <section v-else class="profile-panel profile-panel--empty">
    <h2>Data pegawai tidak ditemukan</h2>
    <p>Silakan hubungi administrator untuk memastikan email Anda terdaftar.</p>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

import { useEmployeeStore } from '../utils/employeeStore'

const props = defineProps({
  email: { type: String, required: true }
})

const { employees, customFields, updateEmployee, getEmployeeByEmail } = useEmployeeStore()

const employee = computed(() => {
  if (!props.email) return null
  return getEmployeeByEmail(props.email) || null
})

const formState = reactive({
  phone: '',
  address: '',
  bankName: '',
  bankAccount: '',
  emergencyContactName: '',
  emergencyContactPhone: ''
})

const customValues = reactive({})
const feedback = ref('')
const isSaving = ref(false)

const syncForm = () => {
  if (!employee.value) return
  formState.phone = employee.value.phone || ''
  formState.address = employee.value.address || ''
  formState.bankName = employee.value.bankName || ''
  formState.bankAccount = employee.value.bankAccount || ''
  formState.emergencyContactName = employee.value.emergencyContactName || ''
  formState.emergencyContactPhone = employee.value.emergencyContactPhone || ''

  Object.keys(customValues).forEach((key) => delete customValues[key])
  customFields.value.forEach((field) => {
    customValues[field.key] = employee.value.customValues?.[field.key] || ''
  })
}

watch(employee, syncForm, { immediate: true })
watch(customFields, syncForm, { deep: true })

const handleSubmit = async () => {
  if (!employee.value) return
  if (isSaving.value) return

  isSaving.value = true
  feedback.value = ''

  updateEmployee(employee.value.id, {
    ...formState,
    customValues: { ...customValues }
  })

  setTimeout(() => {
    feedback.value = 'Perubahan berhasil disimpan.'
    isSaving.value = false
    setTimeout(() => {
      feedback.value = ''
    }, 2500)
  }, 300)
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.profile-panel {
  background: #ffffff;
  border-radius: 26px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 45px rgba(15, 28, 63, 0.08);
}

.profile-panel__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.profile-panel__password {
  font-family: 'Fira Code', 'Source Code Pro', monospace;
  letter-spacing: 0.4px;
  color: #1f3c88;
}

.profile-panel__header h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
}

.profile-panel__header p {
  color: #6a7190;
  font-size: 14px;
}

.profile-panel__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.profile-card {
  background: rgba(248, 250, 255, 0.7);
  border: 1px solid rgba(31, 60, 136, 0.08);
  border-radius: 22px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.profile-card h3 {
  font-size: 16px;
  font-weight: 600;
}

dl {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 0;
}

dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px dashed rgba(31, 60, 136, 0.12);
  padding-bottom: 8px;
}

 dt {
  font-size: 13px;
  color: #6a7190;
}

 dd {
  margin: 0;
  font-weight: 600;
  color: #1b2142;
}

.form-grid {
  display: grid;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field span {
  font-size: 13px;
  color: #1b2142;
  font-weight: 600;
}

.form-field input,
.form-field textarea {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(31, 60, 136, 0.15);
  background: #ffffff;
  font-size: 14px;
  color: #1b2142;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.button--primary {
  background: linear-gradient(135deg, #0b2c59 0%, #154e8a 100%);
  color: #ffffff;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-panel__feedback {
  font-size: 13px;
  color: #1f3c88;
  font-weight: 600;
}

.profile-panel--empty {
  align-items: center;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .profile-panel__header {
    align-items: stretch;
  }

  .profile-panel__header button {
    width: 100%;
  }
}
</style>
