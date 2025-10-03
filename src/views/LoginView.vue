<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-card__info">
        <div class="brand">
          <span class="brand__symbol">AMK</span>
          <span class="brand__title">Portal Penggajian</span>
        </div>
        <h1>Masuk ke akun Anda</h1>
        <p>Kelola slip gaji dan informasi pegawai dalam satu tempat yang rapi.</p>
        <form class="login-form" @submit.prevent="handleLogin">
          <label>
            Email
            <input
              v-model.trim="email"
              type="email"
              placeholder="nama@perusahaan.com"
              autocomplete="email"
              required
            />
          </label>
          <label>
            Kata sandi
            <input
              v-model="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              placeholder="Masukkan kata sandi"
              autocomplete="current-password"
              required
            />
          </label>
          <div class="form-footer">
            <label class="remember">
              <input type="checkbox" v-model="rememberMe" />
              Ingat saya
            </label>
            <button type="button" class="toggle-password" @click="togglePasswordVisibility">
              {{ isPasswordVisible ? 'Sembunyikan' : 'Tampilkan' }}
            </button>
          </div>
          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
          <button type="submit">Masuk</button>
        </form>
        <div class="login-links">
          <span>Belum punya akun?</span>
          <a href="#">Hubungi administrator</a>
        </div>
      </div>
      <div class="login-card__preview">
        <div class="preview-overlay">
          <h2>Ringkas &amp; modern</h2>
          <p>Desain dashboard yang elegan mempermudah Anda memantau performa perusahaan.</p>
          <div class="login-hint">
            <p>Coba masuk menggunakan akun demo:</p>
            <ul>
              <li><strong>Admin:</strong> admin@amk.com / admin123</li>
              <li><strong>Pegawai:</strong> pegawai@amk.com / pegawai123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ROLE_ROUTES, storeUserSession } from '../utils/auth'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const isPasswordVisible = ref(false)

const dummyAccounts = [
  {
    email: 'admin@amk.com',
    password: 'admin123',
    role: 'admin',
    name: 'Naufal Pratama',
    position: 'Administrator HR'
  },
  {
    email: 'pegawai@amk.com',
    password: 'pegawai123',
    role: 'pegawai',
    name: 'Raisa Dewi',
    position: 'Spesialis Marketing'
  }
]

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const handleLogin = () => {
  const account = dummyAccounts.find(
    (item) => item.email.toLowerCase() === email.value.toLowerCase() && item.password === password.value
  )

  if (!account) {
    errorMessage.value = 'Email atau kata sandi salah. Silakan coba lagi.'
    return
  }

  storeUserSession({
    email: account.email,
    role: account.role,
    name: account.name,
    position: account.position,
    remember: rememberMe.value
  })

  errorMessage.value = ''
  const redirectTarget = route.query.redirect
  const targetPath =
    typeof redirectTarget === 'string' && redirectTarget.length
      ? redirectTarget
      : ROLE_ROUTES[account.role]

  router.push(targetPath)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: radial-gradient(circle at top left, #1f2d66, #0f1434 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.login-card {
  width: min(960px, 100%);
  background: rgba(255, 255, 255, 0.06);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  box-shadow: 0 40px 80px rgba(7, 12, 32, 0.45);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  overflow: hidden;
}

.login-card__info {
  padding: 48px;
  background: rgba(11, 20, 60, 0.85);
  color: #f4f7ff;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brand__symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1f3c88, #2f63ff);
  color: #fff;
  font-weight: 700;
  font-size: 18px;
}

.brand__title {
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.login-card h1 {
  font-size: 32px;
  line-height: 1.2;
  font-weight: 600;
}

.login-card p {
  color: rgba(240, 243, 255, 0.7);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: rgba(240, 243, 255, 0.85);
}

.login-form input {
  background: rgba(10, 15, 42, 0.9);
  border: 1px solid rgba(77, 95, 171, 0.6);
  border-radius: 14px;
  padding: 14px 16px;
  color: #f4f7ff;
  font-size: 15px;
}

.login-form input:focus {
  outline: none;
  border-color: #5d8dff;
  box-shadow: 0 0 0 3px rgba(93, 141, 255, 0.25);
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(240, 243, 255, 0.7);
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-password {
  background: none;
  border: none;
  color: #7ea2ff;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.form-footer a,
.login-links a {
  color: #7ea2ff;
}

.form-error {
  background: rgba(255, 90, 90, 0.12);
  border: 1px solid rgba(255, 138, 138, 0.4);
  color: #ffd6d6;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13px;
}

.login-form button[type='submit'] {
  margin-top: 8px;
  background: linear-gradient(135deg, #3558ff, #1f3c88);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-form button[type='submit']:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(12, 21, 59, 0.35);
}

.login-links {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(240, 243, 255, 0.75);
}

.login-card__preview {
  position: relative;
  background: url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80')
    center/cover;
  min-height: 320px;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(9, 15, 43, 0.65), rgba(15, 24, 59, 0.95));
  color: #f4f7ff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 48px;
  gap: 16px;
}

.login-hint {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  font-size: 13px;
  color: rgba(244, 247, 255, 0.9);
}

.login-hint ul {
  margin-top: 8px;
  display: grid;
  gap: 6px;
  list-style: none;
  padding: 0;
}

.login-hint strong {
  font-weight: 600;
}

@media (max-width: 768px) {
  .login-card {
    border-radius: 24px;
  }

  .login-card__info,
  .preview-overlay {
    padding: 32px 24px;
  }
}

@media (max-width: 520px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .login-card__preview {
    order: -1;
  }
}
</style>
