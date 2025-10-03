<template>
  <section class="employee-manager">
    <header class="employee-manager__header">
      <div>
        <h2>Data Pegawai</h2>
        <p>Kelola biodata, kredensial, dan field tambahan untuk seluruh pegawai.</p>
      </div>
      <div class="employee-manager__actions">
        <label class="page-size">
          Tampilkan
          <select v-model.number="pageSize">
            <option v-for="option in pageOptions" :key="option" :value="option">{{ option }}</option>
          </select>
          baris
        </label>
        <button type="button" class="button button--primary" @click="openCreateForm">Tambah pegawai</button>
      </div>
    </header>

    <div class="employee-manager__controls">
      <div class="search">
        <span class="search__icon">🔍</span>
        <input v-model.trim="searchQuery" type="search" placeholder="Cari nama, nomor pegawai, departemen, atau email" />
      </div>
      <form class="custom-field" @submit.prevent="handleAddField">
        <input v-model.trim="newFieldName" type="text" placeholder="Tambah field biodata baru" />
        <button type="submit" class="button">Tambah field</button>
      </form>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>No. Pegawai</th>
            <th>Nama</th>
            <th>Departemen</th>
            <th>Jabatan</th>
            <th>Email</th>
            <th>Kata sandi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in paginatedEmployees" :key="employee.id">
            <td>{{ employee.employeeNumber }}</td>
            <td>
              <div class="table-name">
                <strong>{{ employee.name }}</strong>
                <span>{{ employee.phone || 'Belum diisi' }}</span>
              </div>
            </td>
            <td>{{ employee.department }}</td>
            <td>{{ employee.position }}</td>
            <td>{{ employee.email }}</td>
            <td class="password">{{ employee.password }}</td>
            <td>
              <div class="row-actions">
                <button type="button" class="link" @click="openEditForm(employee)">Ubah</button>
                <button type="button" class="link link--danger" @click="confirmRemoval(employee)">Hapus</button>
              </div>
            </td>
          </tr>
          <tr v-if="!paginatedEmployees.length">
            <td colspan="7" class="empty">Belum ada data yang cocok dengan pencarian.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer class="employee-manager__footer" v-if="filteredEmployees.length">
      <p>Menampilkan {{ startRow }}-{{ endRow }} dari {{ filteredEmployees.length }} pegawai</p>
      <div class="pagination">
        <button type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Sebelumnya</button>
        <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button type="button" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Berikutnya</button>
      </div>
    </footer>

    <transition name="fade">
      <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
        <section class="modal">
          <header class="modal__header">
            <div>
              <h3>{{ isEditMode ? 'Ubah data pegawai' : 'Tambah pegawai baru' }}</h3>
              <p>Field kustom yang ditambahkan akan otomatis tersedia di akun pegawai.</p>
            </div>
            <button type="button" class="modal__close" @click="closeForm">×</button>
          </header>

          <form class="modal__form" @submit.prevent="handleSubmit">
            <div class="modal__grid">
              <label v-for="field in formFields" :key="field.key" :class="['form-field', { 'form-field--full': field.fullWidth }]
                ">
                <span>{{ field.label }}</span>
                <input
                  v-if="field.type !== 'textarea'"
                  v-model="formState[field.key]"
                  :type="field.type"
                  :required="field.required"
                  :disabled="isEditMode && field.readonlyOnEdit"
                />
                <textarea
                  v-else
                  v-model="formState[field.key]"
                  :required="field.required"
                  rows="3"
                ></textarea>
              </label>
            </div>

            <div v-if="customFields.length" class="modal__custom">
              <h4>Field tambahan</h4>
              <div class="modal__grid">
                <label v-for="field in customFields" :key="field.id" class="form-field form-field--full">
                  <span>{{ field.label }}</span>
                  <input v-model="formCustomValues[field.key]" type="text" />
                </label>
              </div>
            </div>

            <footer class="modal__footer">
              <button type="button" class="button button--ghost" @click="closeForm">Batal</button>
              <button type="submit" class="button button--primary">Simpan</button>
            </footer>
          </form>
        </section>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="deletingEmployee" class="modal-backdrop" @click.self="cancelRemoval">
        <section class="confirm-modal">
          <h3>Hapus data pegawai?</h3>
          <p>Data <strong>{{ deletingEmployee.name }}</strong> akan dihapus dari daftar pegawai.</p>
          <div class="confirm-modal__actions">
            <button type="button" class="button button--ghost" @click="cancelRemoval">Batalkan</button>
            <button type="button" class="button button--danger" @click="handleRemoval">Ya, hapus</button>
          </div>
        </section>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

import { useEmployeeStore } from '../utils/employeeStore'

const pageOptions = [10, 20, 30, 40]

const {
  employees,
  customFields,
  sortedEmployees,
  addEmployee,
  updateEmployee,
  removeEmployee,
  addCustomField
} = useEmployeeStore()

const searchQuery = ref('')
const pageSize = ref(pageOptions[0])
const currentPage = ref(1)
const showForm = ref(false)
const isEditMode = ref(false)
const editingEmployeeId = ref('')
const deletingEmployee = ref(null)
const newFieldName = ref('')

const baseFormState = () => ({
  employeeNumber: '',
  name: '',
  email: '',
  password: '',
  department: '',
  position: '',
  phone: '',
  address: '',
  joinDate: '',
  bankName: '',
  bankAccount: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  dateOfBirth: ''
})

const formState = reactive(baseFormState())
const formCustomValues = reactive({})

const formFields = [
  { key: 'employeeNumber', label: 'Nomor Pegawai', type: 'text', required: true, readonlyOnEdit: true },
  { key: 'name', label: 'Nama Lengkap', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'password', label: 'Kata Sandi', type: 'text', required: true },
  { key: 'department', label: 'Departemen', type: 'text', required: true },
  { key: 'position', label: 'Jabatan', type: 'text', required: true },
  { key: 'phone', label: 'Nomor Telepon', type: 'tel', required: false },
  { key: 'address', label: 'Alamat Domisili', type: 'textarea', required: false, fullWidth: true },
  { key: 'dateOfBirth', label: 'Tanggal Lahir', type: 'date', required: false },
  { key: 'joinDate', label: 'Tanggal Bergabung', type: 'date', required: true },
  { key: 'bankName', label: 'Bank', type: 'text', required: false },
  { key: 'bankAccount', label: 'Nomor Rekening', type: 'text', required: false },
  { key: 'emergencyContactName', label: 'Kontak Darurat', type: 'text', required: false },
  { key: 'emergencyContactPhone', label: 'Nomor Kontak Darurat', type: 'tel', required: false }
]

const filteredEmployees = computed(() => {
  const term = searchQuery.value.toLowerCase()
  if (!term) return sortedEmployees.value
  return sortedEmployees.value.filter((employee) => {
    return [
      employee.employeeNumber,
      employee.name,
      employee.department,
      employee.position,
      employee.email
    ]
      .join(' ')
      .toLowerCase()
      .includes(term)
  })
})

const totalPages = computed(() => {
  if (!filteredEmployees.value.length) return 1
  return Math.ceil(filteredEmployees.value.length / pageSize.value)
})

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredEmployees.value.slice(start, start + pageSize.value)
})

const startRow = computed(() => {
  if (!filteredEmployees.value.length) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endRow = computed(() => {
  return Math.min(currentPage.value * pageSize.value, filteredEmployees.value.length)
})

watch([searchQuery, pageSize], () => {
  currentPage.value = 1
})

watch(pageSize, () => {
  if (pageOptions.indexOf(pageSize.value) === -1) {
    pageSize.value = pageOptions[0]
  }
})

watch(
  customFields,
  () => {
    if (!showForm.value) return
    customFields.value.forEach((field) => {
      if (!(field.key in formCustomValues)) {
        formCustomValues[field.key] = ''
      }
    })
  },
  { deep: true }
)

const goToPage = (page) => {
  const safePage = Math.min(Math.max(page, 1), totalPages.value)
  currentPage.value = safePage
}

const openCreateForm = () => {
  Object.assign(formState, baseFormState())
  Object.keys(formCustomValues).forEach((key) => delete formCustomValues[key])
  customFields.value.forEach((field) => {
    formCustomValues[field.key] = ''
  })
  isEditMode.value = false
  editingEmployeeId.value = ''
  showForm.value = true
}

const openEditForm = (employee) => {
  Object.assign(formState, baseFormState(), employee)
  Object.keys(formCustomValues).forEach((key) => delete formCustomValues[key])
  customFields.value.forEach((field) => {
    formCustomValues[field.key] = employee.customValues?.[field.key] || ''
  })
  isEditMode.value = true
  editingEmployeeId.value = employee.id
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const handleSubmit = () => {
  const payload = {
    ...formState,
    customValues: { ...formCustomValues }
  }

  if (isEditMode.value) {
    updateEmployee(editingEmployeeId.value, payload)
  } else {
    addEmployee(payload)
  }

  closeForm()
}

const confirmRemoval = (employee) => {
  deletingEmployee.value = employee
}

const cancelRemoval = () => {
  deletingEmployee.value = null
}

const handleRemoval = () => {
  if (deletingEmployee.value) {
    removeEmployee(deletingEmployee.value.id)
  }
  deletingEmployee.value = null
}

const handleAddField = () => {
  if (!newFieldName.value) return
  addCustomField(newFieldName.value)
  newFieldName.value = ''
}
</script>

<style scoped>
.employee-manager {
  background: #ffffff;
  border-radius: 26px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 45px rgba(15, 28, 63, 0.08);
}

.employee-manager__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.employee-manager__header h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
}

.employee-manager__header p {
  color: #6a7190;
  font-size: 14px;
}

.employee-manager__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-size {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(31, 60, 136, 0.08);
  font-size: 14px;
  color: #1b2142;
}

.page-size select {
  border: none;
  background: transparent;
  font-weight: 600;
  color: inherit;
  cursor: pointer;
}

.employee-manager__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.search {
  position: relative;
  flex: 1 1 320px;
}

.search__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #7f87aa;
}

.search input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border-radius: 16px;
  border: 1px solid rgba(31, 60, 136, 0.15);
  background: rgba(248, 250, 255, 0.7);
  font-size: 14px;
  color: #1b2142;
}

.custom-field {
  display: flex;
  gap: 12px;
  flex: 1 1 280px;
}

.custom-field input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid rgba(31, 60, 136, 0.15);
  background: rgba(248, 250, 255, 0.7);
  font-size: 14px;
}

.table-wrapper {
  border: 1px solid rgba(31, 60, 136, 0.08);
  border-radius: 20px;
  overflow: hidden;
}

.table-wrapper table {
  width: 100%;
  border-collapse: collapse;
}

.table-wrapper thead {
  background: rgba(31, 60, 136, 0.08);
}

.table-wrapper th,
.table-wrapper td {
  padding: 14px 18px;
  text-align: left;
  font-size: 14px;
}

.table-wrapper tbody tr:nth-child(even) {
  background: rgba(250, 252, 255, 0.6);
}

.table-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.table-name span {
  font-size: 12px;
  color: #6a7190;
}

.password {
  font-family: 'Fira Code', 'Source Code Pro', monospace;
  font-size: 13px;
}

.row-actions {
  display: inline-flex;
  gap: 10px;
}

.link {
  border: none;
  background: none;
  color: #1f3c88;
  font-weight: 600;
  cursor: pointer;
}

.link--danger {
  color: #d95050;
}

.empty {
  text-align: center;
  padding: 24px;
  color: #7f87aa;
}

.employee-manager__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  font-size: 13px;
  color: #6a7190;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination button {
  border: none;
  padding: 8px 14px;
  border-radius: 12px;
  background: rgba(31, 60, 136, 0.12);
  color: #1b2142;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

.button--ghost {
  background: rgba(31, 60, 136, 0.08);
  color: #1b2142;
}

.button--danger {
  background: #d95050;
  color: #ffffff;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 16, 35, 0.55);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 80;
}

.modal {
  width: min(780px, 100%);
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(11, 28, 63, 0.25);
  display: flex;
  flex-direction: column;
}

.modal__header {
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid rgba(31, 60, 136, 0.08);
}

.modal__header h3 {
  font-size: 20px;
  font-weight: 600;
}

.modal__header p {
  color: #6a7190;
  font-size: 13px;
}

.modal__close {
  border: none;
  background: none;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  color: #7f87aa;
}

.modal__form {
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
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
  background: rgba(248, 250, 255, 0.7);
  font-size: 14px;
  color: #1b2142;
}

.form-field textarea {
  resize: vertical;
  min-height: 96px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.modal__custom h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

.modal__footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.confirm-modal {
  width: min(380px, 100%);
  background: #ffffff;
  border-radius: 22px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: center;
}

.confirm-modal__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
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
  .employee-manager__header {
    flex-direction: column;
    align-items: stretch;
  }

  .employee-manager__actions {
    justify-content: space-between;
  }

  .employee-manager__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .custom-field {
    width: 100%;
  }

  .modal {
    max-height: 90vh;
    overflow-y: auto;
  }
}
</style>
