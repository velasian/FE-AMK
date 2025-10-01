import { computed, ref } from 'vue'

const USERS = {
  'admin@amk-portal.test': {
    password: 'Admin123!',
    role: 'admin',
    name: 'Admin Utama',
  },
  'pegawai@amk-portal.test': {
    password: 'Pegawai123!',
    role: 'pegawai',
    name: 'Pegawai Andalan',
  },
  'officer@amk-portal.test': {
    password: 'Officer123!',
    role: 'officer',
    name: 'Officer Monitoring',
  },
}

const DASHBOARD_PATHS = {
  admin: '/dashboard/admin',
  pegawai: '/dashboard/pegawai',
  officer: '/dashboard/officer',
}

function getStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem('amk-portal:user')

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Failed to parse stored user', error)
    return null
  }
}

const currentUser = ref(getStoredUser())

function persistUser(user) {
  if (typeof window === 'undefined') {
    return
  }

  if (!user) {
    window.localStorage.removeItem('amk-portal:user')
    return
  }

  window.localStorage.setItem('amk-portal:user', JSON.stringify(user))
}

export function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const userRecord = USERS[normalizedEmail]

  if (!userRecord || userRecord.password !== password) {
    throw new Error('Email atau kata sandi salah')
  }

  const user = {
    email: normalizedEmail,
    role: userRecord.role,
    name: userRecord.name,
  }

  currentUser.value = user
  persistUser(user)

  return user
}

export function logout() {
  currentUser.value = null
  persistUser(null)
}

export function getCurrentUser() {
  return currentUser.value
}

export function isAuthenticated() {
  return Boolean(currentUser.value)
}

export function getDashboardPathForRole(role) {
  return DASHBOARD_PATHS[role] || '/'
}

export function useAuth() {
  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated: computed(() => Boolean(currentUser.value)),
    login,
    logout,
    getDashboardPathForRole,
  }
}
