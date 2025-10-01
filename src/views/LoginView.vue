<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  email: '',
  password: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // TODO: Hubungkan fungsi ini ke endpoint autentikasi Laravel (misalnya menggunakan fetch/axios).
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.table(form)
  } catch (error) {
    errorMessage.value = 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <header class="login-card__intro">
        <p class="badge">AMK Portal</p>
        <h1>Selamat datang kembali</h1>
        <p class="subtitle">
          Kelola aktivitas perusahaan Anda melalui satu pintu. Login menggunakan akun yang diberikan oleh
          superadmin.
        </p>
      </header>

      <form class="login-form" @submit.prevent="handleSubmit">
        <label class="form-field">
          <span>Email</span>
          <input v-model="form.email" type="email" name="email" placeholder="nama@perusahaan.com" required />
        </label>

        <label class="form-field">
          <span>Kata sandi</span>
          <input v-model="form.password" type="password" name="password" placeholder="Masukkan kata sandi" required />
        </label>

        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

        <button class="submit-btn" type="submit" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Masuk</span>
          <span v-else>Memproses…</span>
        </button>

        <p class="helper-text">Butuh bantuan? Hubungi superadmin Anda.</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ff8c42 0%, #ffb347 50%, #ffffff 100%);
}

.login-card {
  width: min(100%, 960px);
  display: grid;
  gap: 2.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  background: rgba(255, 255, 255, 0.94);
  border-radius: 28px;
  padding: clamp(2rem, 5vw, 3.5rem);
  box-shadow: 0 24px 80px -32px rgba(255, 104, 30, 0.55);
  backdrop-filter: blur(12px);
}

.login-card__intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
}

.badge {
  align-self: flex-start;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 140, 66, 0.15);
  color: #ff6f3c;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

h1 {
  font-size: clamp(2rem, 5vw, 2.8rem);
  color: #1f2937;
  font-weight: 700;
  line-height: 1.1;
}

.subtitle {
  color: #4b5563;
  font-size: clamp(0.95rem, 2vw, 1.05rem);
  max-width: 32ch;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-size: 0.95rem;
  color: #374151;
}

.form-field span {
  font-weight: 600;
}

input {
  border: 1px solid rgba(255, 111, 60, 0.35);
  border-radius: 14px;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

input:focus {
  outline: none;
  border-color: #ff6f3c;
  box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.25);
}

.form-error {
  color: #d14334;
  background: rgba(209, 67, 52, 0.12);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.submit-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border: none;
  border-radius: 14px;
  padding: 0.95rem 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #ff6f3c, #ff914d);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px -16px rgba(255, 111, 60, 0.75);
  filter: brightness(1.02);
}

.submit-btn:disabled {
  opacity: 0.75;
  cursor: progress;
}

.helper-text {
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }

  .login-card {
    padding: clamp(1.75rem, 4vw, 2.5rem);
    gap: 2rem;
  }

  .login-card__intro {
    text-align: center;
    align-items: center;
  }

  .badge {
    align-self: center;
  }

  .subtitle {
    max-width: none;
  }
}
</style>
