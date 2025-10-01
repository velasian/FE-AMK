<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  email: '',
  password: '',
  remember: true,
})

const isLoading = ref(false)
const message = ref('')

const handleLogin = async () => {
  message.value = ''
  isLoading.value = true

  try {
    // TODO: Hubungkan fungsi ini dengan endpoint autentikasi Laravel Sanctum Anda.
    // Contohnya, gunakan axios/fetch untuk mengirim `form.email` dan `form.password`
    // ke rute login Sanctum dan kelola penyimpanan token sesuai kebutuhan aplikasi.
    await new Promise((resolve) => setTimeout(resolve, 800))
    message.value =
      'Contoh UI saja — silakan sambungkan dengan backend Laravel Sanctum Anda.'
  } catch (error) {
    message.value = 'Terjadi kesalahan saat mencoba login. Coba lagi nanti.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="blur-circle blur-circle--one" aria-hidden="true"></div>
    <div class="blur-circle blur-circle--two" aria-hidden="true"></div>

    <main class="main" aria-labelledby="login-heading">
      <section class="glass-card">
        <header class="card-header">
          <h1 id="login-heading">Masuk ke Akun Anda</h1>
          <p class="card-subtitle">
            Silakan pakai email dan kata sandi perusahaan untuk melanjutkan.
          </p>
        </header>

        <form class="form" @submit.prevent="handleLogin">
          <label class="field">
            <span>Email</span>
            <input
              v-model="form.email"
              type="email"
              placeholder="nama@email.com"
              required
            />
          </label>

          <label class="field">
            <span>Kata Sandi</span>
            <input
              v-model="form.password"
              type="password"
              placeholder="Minimal 8 karakter"
              minlength="8"
              required
            />
          </label>

          <label class="remember">
            <input v-model="form.remember" type="checkbox" />
            <span>Ingat saya</span>
          </label>

          <!-- Integrasikan fungsi submit ini dengan endpoint login Laravel Sanctum Anda. -->
          <!-- Contoh: kirim `form.email` dan `form.password` memakai axios/fetch -->
          <!-- lalu simpan token/Session sesuai kebutuhan aplikasi perusahaan. -->
          <button class="submit" type="submit" :disabled="isLoading">
            <span v-if="!isLoading">Masuk Sekarang</span>
            <span v-else>Menghubungkan...</span>
          </button>
        </form>

        <p v-if="message" class="form-message">{{ message }}</p>

        <div class="card-footer">
          <span>Butuh bantuan? Hubungi admin IT.</span>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #081a34;
  color: #0f172a;
}

.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #071126 0%, #13294b 55%, #0a1f44 100%);
  overflow: hidden;
  position: relative;
  padding: clamp(1.5rem, 4vw, 3rem);
}

.blur-circle {
  position: absolute;
  width: 28rem;
  height: 28rem;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  z-index: 0;
}

.blur-circle--one {
  background: #1f65ff;
  top: -10rem;
  left: -8rem;
}

.blur-circle--two {
  background: #5be4ff;
  bottom: -12rem;
  right: -10rem;
}


.main {
  width: min(500px, 100%);
  z-index: 1;
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 32px;
  backdrop-filter: blur(14px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
  padding: clamp(2.2rem, 5vw, 3.2rem);
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.4rem);
  color: #f8fbff;
}

.card-header {
  display: grid;
  gap: 0.75rem;
}

.card-header h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 2.8rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.card-subtitle {
  margin: 0;
  font-size: clamp(0.95rem, 2.8vw, 1.05rem);
  color: rgba(248, 251, 255, 0.8);
  line-height: 1.6;
}

.form {
  display: grid;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.field {
  display: grid;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #0a1f44;
}

.field span {
  font-weight: 600;
}


.field input {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  font-size: 1rem;
  color: #f8fbff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}


.field input::placeholder {
  color: rgba(248, 251, 255, 0.55);
}

.field input:focus {
  outline: none;
  border-color: rgba(91, 228, 255, 0.85);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 4px rgba(91, 228, 255, 0.25);
}


.remember {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(248, 251, 255, 0.8);
  font-size: 0.9rem;
}


.remember input {
  width: 18px;
  height: 18px;
  accent-color: #5be4ff;
}


.submit {
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #1f65ff, #3a8dff);
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.02em;
  font-size: 1.05rem;
  padding: 0.95rem 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit:hover:enabled {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(31, 101, 255, 0.35);
}

.submit:active:enabled {
  transform: translateY(0);
}

.submit:disabled {
  opacity: 0.7;
  cursor: progress;
}


.form-message {
  margin: 0;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  color: #e1f0ff;
  border: 1px solid rgba(91, 228, 255, 0.28);
  font-size: 0.92rem;
}

.card-footer {
  font-size: 0.85rem;
  color: rgba(248, 251, 255, 0.65);
  text-align: center;
}

@media (max-width: 768px) {
  .page {
    padding: 2rem 1.5rem;
  }

  .main {
    width: 100%;
  }

  .glass-card {
    border-radius: 24px;
    padding: clamp(1.8rem, 6vw, 2.4rem);
  }

  .card-header {
    text-align: center;
  }
}
</style>
