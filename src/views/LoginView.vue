<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDashboardPathForRole, login, useAuth } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const { currentUser } = useAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

if (currentUser.value) {
  router.replace(getDashboardPathForRole(currentUser.value.role))
}

async function handleSubmit() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Harap isi email dan kata sandi.'
    return
  }

  isSubmitting.value = true
  try {
    const user = login(email.value, password.value)
    const redirectPath = route.query.redirect || getDashboardPathForRole(user.role)
    router.replace(redirectPath)
  } catch (error) {
    errorMessage.value = error.message || 'Terjadi kesalahan saat login.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="background-pattern"></div>
    <div class="login-card">
      <div class="card-glass">
        <div class="card-header">
          <h1>Selamat Datang Kembali</h1>
          <p>Masuk untuk mengakses portal karyawan AMK.</p>
        </div>

        <form class="login-form" @submit.prevent="handleSubmit">
          <label class="field">
            <span>Email</span>
            <input v-model="email" type="email" placeholder="nama@amk-portal.test" autocomplete="username" />
          </label>

          <label class="field">
            <span>Kata Sandi</span>
            <input
              v-model="password"
              type="password"
              placeholder="Masukkan kata sandi"
              autocomplete="current-password"
            />
          </label>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.35), transparent 60%),
    #05102a;
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
}

.background-pattern::before,
.background-pattern::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
}

.background-pattern::before {
  width: 380px;
  height: 380px;
  background: rgba(59, 130, 246, 0.4);
  top: -120px;
  right: 12%;
}

.background-pattern::after {
  width: 340px;
  height: 340px;
  background: rgba(34, 211, 238, 0.35);
  bottom: -100px;
  left: 10%;
}

.login-card {
  position: relative;
  max-width: 420px;
  width: 100%;
  z-index: 1;
}

.card-glass {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  padding: 2.8rem 2.4rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 30px 80px rgba(5, 16, 42, 0.35);
  backdrop-filter: blur(22px);
  color: #f5f7ff;
}

.card-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.card-header p {
  margin: 0.75rem 0 2rem;
  color: rgba(245, 247, 255, 0.75);
  line-height: 1.6;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.field span {
  font-weight: 600;
  font-size: 0.95rem;
}

.field input {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.85rem 1rem;
  font-size: 1rem;
  background: rgba(5, 16, 42, 0.4);
  color: #f5f7ff;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.field input:focus {
  outline: none;
  border-color: rgba(96, 165, 250, 0.8);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.25);
}

.error-message {
  margin: 0;
  font-size: 0.9rem;
  color: #fca5a5;
}

button[type='submit'] {
  border: none;
  border-radius: 16px;
  padding: 0.95rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(139, 92, 246, 0.95));
  color: #f5f7ff;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

button[type='submit']:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(59, 130, 246, 0.45);
}

button[type='submit']:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

@media (max-width: 540px) {
  .card-glass {
    padding: 2.2rem 1.8rem;
  }

  .card-header h1 {
    font-size: 1.65rem;
  }
}
</style>
