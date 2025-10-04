import { computed, ref, watch } from 'vue'

const EMPLOYEE_STORAGE_KEY = 'amk-portal-employees'
const FIELD_STORAGE_KEY = 'amk-portal-employee-fields'

const defaultCustomFields = [
  { id: 'field-sertifikasi', key: 'sertifikasi', label: 'Sertifikasi Profesional' }
]

const defaultEmployees = [
  {
    id: 'emp-001',
    employeeNumber: 'AMK-001',
    name: 'Raisa Dewi',
    email: 'pegawai@amk.com',
    password: 'pegawai123',
    department: 'Marketing',
    position: 'Spesialis Marketing',
    phone: '0812-3456-7890',
    address: 'Jl. Melati No. 5, Jakarta',
    joinDate: '2021-01-12',
    bankName: 'BCA',
    bankAccount: '1234567890',
    emergencyContactName: 'Dinda Lestari',
    emergencyContactPhone: '0813-9876-5432',
    dateOfBirth: '1995-06-21',
    customValues: {
      sertifikasi: 'Google Analytics Individual Qualification'
    }
  },
  {
    id: 'emp-002',
    employeeNumber: 'AMK-002',
    name: 'Hafidz Maulana',
    email: 'hafidz@amk.com',
    password: 'hafidz123',
    department: 'Finance',
    position: 'Analis Keuangan',
    phone: '0817-2233-4455',
    address: 'Jl. Kenanga No. 12, Bandung',
    joinDate: '2020-08-03',
    bankName: 'Mandiri',
    bankAccount: '9876543210',
    emergencyContactName: 'Rina Maulana',
    emergencyContactPhone: '0812-6655-4321',
    dateOfBirth: '1992-02-14',
    customValues: {
      sertifikasi: 'Brevet Pajak AB'
    }
  },
  {
    id: 'emp-003',
    employeeNumber: 'AMK-003',
    name: 'Putri Anggraini',
    email: 'putri@amk.com',
    password: 'putri123',
    department: 'Human Capital',
    position: 'HR Generalist',
    phone: '0813-4455-6677',
    address: 'Jl. Cemara No. 8, Surabaya',
    joinDate: '2022-05-18',
    bankName: 'BNI',
    bankAccount: '4567890123',
    emergencyContactName: 'Adi Santoso',
    emergencyContactPhone: '0813-2244-6688',
    dateOfBirth: '1994-11-02',
    customValues: {
      sertifikasi: 'Certified Human Resource Professional'
    }
  }
]

const employees = ref([])
const customFields = ref([])
let hydrated = false

const ensureCustomValues = (record) => {
  const values = { ...(record.customValues || {}) }
  customFields.value.forEach((field) => {
    if (typeof values[field.key] === 'undefined') {
      values[field.key] = ''
    }
  })
  return { ...record, customValues: values }
}

const persistEmployees = (data) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(data))
}

const persistFields = (data) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(data))
}

const hydrate = () => {
  if (hydrated) return

  if (typeof window === 'undefined') {
    customFields.value = [...defaultCustomFields]
    employees.value = defaultEmployees.map((item) => ({
      ...item,
      customValues: { ...item.customValues }
    }))
    hydrated = true
    return
  }

  try {
    const storedFields = window.localStorage.getItem(FIELD_STORAGE_KEY)
    if (storedFields) {
      customFields.value = JSON.parse(storedFields)
    } else {
      customFields.value = [...defaultCustomFields]
      persistFields(customFields.value)
    }
  } catch (error) {
    console.warn('Gagal membaca data field kustom, menggunakan nilai bawaan', error)
    customFields.value = [...defaultCustomFields]
  }

  try {
    const storedEmployees = window.localStorage.getItem(EMPLOYEE_STORAGE_KEY)
    if (storedEmployees) {
      employees.value = JSON.parse(storedEmployees)
    } else {
      employees.value = defaultEmployees.map((item) => ({
        ...item,
        customValues: { ...item.customValues }
      }))
      persistEmployees(employees.value)
    }
  } catch (error) {
    console.warn('Gagal membaca data pegawai, menggunakan nilai bawaan', error)
    employees.value = defaultEmployees.map((item) => ({
      ...item,
      customValues: { ...item.customValues }
    }))
  }

  employees.value = employees.value.map((record) => ensureCustomValues(record))

  hydrated = true

  watch(
    employees,
    (value) => {
      persistEmployees(value)
    },
    { deep: true }
  )

  watch(
    customFields,
    (value) => {
      persistFields(value)
      employees.value = employees.value.map((record) => ensureCustomValues(record))
    },
    { deep: true }
  )
}

const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const generateId = (prefix) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export const useEmployeeStore = () => {
  hydrate()

  const sortedEmployees = computed(() => {
    return [...employees.value].sort((a, b) => a.name.localeCompare(b.name))
  })

  const addEmployee = (payload) => {
    const id = payload.id || generateId('emp')
    const base = ensureCustomValues({
      ...payload,
      id,
      customValues: { ...(payload.customValues || {}) }
    })
    employees.value = [...employees.value, base]
    return id
  }

  const updateEmployee = (id, updates) => {
    employees.value = employees.value.map((employee) => {
      if (employee.id !== id) return employee
      return ensureCustomValues({
        ...employee,
        ...updates,
        customValues: {
          ...employee.customValues,
          ...(updates.customValues || {})
        }
      })
    })
  }

  const removeEmployee = (id) => {
    employees.value = employees.value.filter((employee) => employee.id !== id)
  }

  const addCustomField = (label) => {
    const trimmed = label.trim()
    if (!trimmed) return null

    let key = slugify(trimmed)
    if (!key) {
      key = `field-${customFields.value.length + 1}`
    }

    let attempt = 1
    const existingKeys = new Set(customFields.value.map((field) => field.key))
    while (existingKeys.has(key)) {
      attempt += 1
      key = `${slugify(trimmed)}-${attempt}`
    }

    const field = {
      id: generateId('field'),
      key,
      label: trimmed
    }

    customFields.value = [...customFields.value, field]
    employees.value = employees.value.map((record) => ({
      ...record,
      customValues: { ...record.customValues, [key]: '' }
    }))

    return field
  }

  const removeCustomField = (id) => {
    const field = customFields.value.find((item) => item.id === id)
    if (!field) return

    customFields.value = customFields.value.filter((item) => item.id !== id)

    employees.value = employees.value.map((record) => {
      if (!record.customValues) return { ...record }
      const { [field.key]: _removed, ...rest } = record.customValues
      return {
        ...record,
        customValues: { ...rest }
      }
    })

    return field
  }

  const upsertCustomValue = (employeeId, fieldKey, value) => {
    updateEmployee(employeeId, {
      customValues: {
        [fieldKey]: value
      }
    })
  }

  const getEmployeeByEmail = (email) => {
    return employees.value.find((employee) => employee.email.toLowerCase() === email.toLowerCase())
  }

  return {
    employees,
    customFields,
    sortedEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    addCustomField,
    removeCustomField,
    upsertCustomValue,
    getEmployeeByEmail
  }
}
