const STORAGE_KEY = 'amk-portal-auth'

export const ROLE_ROUTES = {
  admin: '/admin',
  pegawai: '/pegawai'
}

export function storeUserSession(user) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Gagal mengurai data sesi pengguna', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function clearUserSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
