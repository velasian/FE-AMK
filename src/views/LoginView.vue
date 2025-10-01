<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="brand-area">
        <h1>AMK Portal 3.0</h1>
        <p>Masuk menggunakan akun yang sesuai dengan peran Anda untuk mengakses dashboard personal.</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <label class="field">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            placeholder="nama@amk.test"
            required
            autocomplete="username"
          />
        </label>

        <label class="field">
          <span>Password</span>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </label>

        <button class="submit" type="submit">
          Masuk
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>

      <div class="dummy-credentials">
        <h2>Akun Dummy untuk Pengujian</h2>
        <p>Klik salah satu untuk mengisi otomatis.</p>
        <ul>
          <li v-for="cred in credentials" :key="cred.role">
            <button type="button" @click="prefillCredential(cred)">
              <div class="role">{{ cred.name }} ({{ cred.role }})</div>
              <div class="email">{{ cred.email }}</div>
              <div class="password">{{ cred.password }}</div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const credentials = [
  {
    role: 'admin',
    name: 'Administrator',
    email: 'admin@amk.test',
    password: 'admin123'
  },
  {
    role: 'pegawai',
    name: 'Pegawai',
    email: 'pegawai@amk.test',
    password: 'pegawai123'
  },
  {
    role: 'officer',
    name: 'Officer',
    email: 'officer@amk.test',
    password: 'officer123'
  }
]

const roleRouteMap = {
  admin: '/dashboard/admin',
  pegawai: '/dashboard/pegawai',
  officer: '/dashboard/officer'
}

const handleLogin = () => {
  errorMessage.value = ''
  const user = credentials.find(
    (cred) =>
      cred.email === email.value.trim().toLowerCase() && cred.password === password.value.trim()
  )

  if (!user) {
    errorMessage.value = 'Email atau password tidak valid. Silakan coba lagi.'
    return
  }

  const authUser = {
    role: user.role,
    name: user.name,
    email: user.email
  }

  window.localStorage.setItem('authUser', JSON.stringify(authUser))
  router.push(roleRouteMap[user.role])
}

const prefillCredential = (cred) => {
  email.value = cred.email
  password.value = cred.password
  errorMessage.value = ''
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-card {
  width: min(960px, 100%);
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  box-shadow: 0 40px 80px rgba(15, 23, 42, 0.35);
  padding: clamp(1.5rem, 4vw, 3.5rem);
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.brand-area h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #f8fafc;
}

.brand-area p {
  color: rgba(226, 232, 240, 0.75);
}

.auth-form {
  display: grid;
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.85);
}

.field input {
  height: 48px;
  padding: 0 1rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.4);
  color: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
}

.submit {
  height: 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  color: #0f172a;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(37, 99, 235, 0.35);
}

.error-message {
  margin-top: 0.25rem;
  color: #fca5a5;
  font-size: 0.9rem;
}

.dummy-credentials {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 18px;
  padding: clamp(1rem, 2.5vw, 1.5rem);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.dummy-credentials h2 {
  font-size: 1.1rem;
  margin-bottom: 0.35rem;
  color: #f1f5f9;
}

.dummy-credentials p {
  font-size: 0.85rem;
  color: rgba(226, 232, 240, 0.7);
  margin-bottom: 0.75rem;
}

.dummy-credentials ul {
  list-style: none;
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
}

.dummy-credentials li button {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  border: 1px solid transparent;
  background: rgba(15, 23, 42, 0.55);
  color: #e2e8f0;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.dummy-credentials li button:hover {
  border-color: rgba(96, 165, 250, 0.6);
  background: rgba(30, 64, 175, 0.35);
}

.dummy-credentials .role {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.dummy-credentials .email,
.dummy-credentials .password {
  font-size: 0.85rem;
  color: rgba(226, 232, 240, 0.8);
}

@media (min-width: 960px) {
  .auth-card {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .auth-form {
    align-self: stretch;
  }
}

@media (max-width: 640px) {
  .auth-card {
    padding: 1.5rem;
  }

  .dummy-credentials li button {
    font-size: 0.85rem;
  }
}
</style>
