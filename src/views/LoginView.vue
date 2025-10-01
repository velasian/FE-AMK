<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  email: '',
  password: '',
  remember: true,
})

const isLoading = ref(false)
const feedback = ref('')

const handleLogin = async () => {
  feedback.value = ''
  isLoading.value = true

  try {
    // TODO: Sambungkan aksi ini ke endpoint login Laravel Sanctum Anda.
    // Gunakan axios/fetch untuk mengirim `form.email` dan `form.password`
    // ke rute autentikasi Sanctum, lalu kelola token atau session sesuai kebutuhan.
    await new Promise((resolve) => setTimeout(resolve, 800))
    feedback.value =
      'UI siap dipakai — lanjutkan integrasi dengan Laravel Sanctum Anda.'
  } catch (error) {
    feedback.value = 'Terjadi kendala saat masuk. Silakan coba kembali.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-shell">
    <div class="auth-shell__glow auth-shell__glow--one" aria-hidden="true"></div>
    <div class="auth-shell__glow auth-shell__glow--two" aria-hidden="true"></div>

    <div class="auth-card" aria-labelledby="login-title">
      <div class="auth-card__brand">
        <span class="auth-card__chip">Portal Pegawai AMK</span>
        <h1 id="login-title">Masuk ke Akun</h1>
        <p>Gunakan kredensial internal untuk mengakses dashboard pegawai.</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <label class="auth-form__field">
          <span>Email Perusahaan</span>
          <input
            v-model="form.email"
            type="email"
            placeholder="pegawai@amk.co.id"
            required
            autocomplete="username"
          />
        </label>

        <label class="auth-form__field">
          <span>Kata Sandi</span>
          <input
            v-model="form.password"
            type="password"
            placeholder="Minimal 8 karakter"
            minlength="8"
            required
            autocomplete="current-password"
          />
        </label>

        <label class="auth-form__remember">
          <input v-model="form.remember" type="checkbox" />
          <span>Ingat saya di perangkat ini</span>
        </label>

        <!-- Kirim `form.email` dan `form.password` dari sini ke login Laravel Sanctum. -->
        <button class="auth-form__submit" type="submit" :disabled="isLoading">
          <span v-if="!isLoading">Masuk Sekarang</span>
          <span v-else>Memverifikasi...</span>
        </button>
      </form>

      <p v-if="feedback" class="auth-card__feedback">{{ feedback }}</p>

      <footer class="auth-card__footer">
        <span>Butuh bantuan? Hubungi tim IT.</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: radial-gradient(circle at 10% 20%, #11254a 0%, #071227 45%, #060d1b 100%);
  color: #0a1f3f;
}

.auth-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 4rem);
  overflow: hidden;
}

.auth-shell__glow {
  position: absolute;
  width: clamp(18rem, 38vw, 32rem);
  height: clamp(18rem, 38vw, 32rem);
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.45;
  z-index: 0;
}

.auth-shell__glow--one {
  background: rgba(42, 124, 255, 0.85);
  top: -12rem;
  left: -8rem;
}

.auth-shell__glow--two {
  background: rgba(91, 228, 255, 0.75);
  bottom: -14rem;
  right: -10rem;
}

.auth-card {
  position: relative;
  z-index: 1;
  width: min(420px, 100%);
  display: grid;
  gap: clamp(1.4rem, 3vw, 2.2rem);
  padding: clamp(2.2rem, 5vw, 3rem);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(18px);
  box-shadow: 0 28px 60px rgba(4, 11, 25, 0.55);
  color: #f2f6ff;
}

.auth-card__brand {
  display: grid;
  gap: 0.75rem;
  text-align: center;
}

.auth-card__chip {
  justify-self: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(16, 63, 145, 0.55);
  border: 1px solid rgba(91, 228, 255, 0.45);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-card__brand h1 {
  margin: 0;
  font-size: clamp(1.9rem, 4.8vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.auth-card__brand p {
  margin: 0;
  font-size: clamp(0.95rem, 2.4vw, 1.05rem);
  color: rgba(242, 246, 255, 0.78);
  line-height: 1.6;
}

.auth-form {
  display: grid;
  gap: clamp(1rem, 3vw, 1.5rem);
}

.auth-form__field {
  display: grid;
  gap: 0.55rem;
  font-size: 0.95rem;
  color: rgba(242, 246, 255, 0.9);
}

.auth-form__field span {
  font-weight: 600;
}

.auth-form__field input {
  padding: 0.85rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: rgba(6, 18, 43, 0.35);
  color: #f2f6ff;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.auth-form__field input::placeholder {
  color: rgba(242, 246, 255, 0.55);
}

.auth-form__field input:focus {
  outline: none;
  border-color: rgba(91, 228, 255, 0.85);
  background: rgba(7, 24, 56, 0.52);
  box-shadow: 0 0 0 4px rgba(91, 228, 255, 0.25);
}

.auth-form__remember {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.88rem;
  color: rgba(242, 246, 255, 0.75);
}

.auth-form__remember input {
  width: 18px;
  height: 18px;
  accent-color: #5be4ff;
}

.auth-form__submit {
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #1f65ff, #3c8dff 55%, #65d1ff 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 1.05rem;
  padding: 0.95rem 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.auth-form__submit:hover:enabled {
  transform: translateY(-2px);
  box-shadow: 0 22px 40px rgba(31, 101, 255, 0.35);
}

.auth-form__submit:active:enabled {
  transform: translateY(0);
}

.auth-form__submit:disabled {
  opacity: 0.7;
  cursor: progress;
}

.auth-card__feedback {
  margin: 0;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: rgba(91, 228, 255, 0.16);
  border: 1px solid rgba(91, 228, 255, 0.35);
  color: #e5f7ff;
  font-size: 0.9rem;
}

.auth-card__footer {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(242, 246, 255, 0.65);
}

@media (min-width: 768px) {
  .auth-card {
    width: min(460px, 100%);
  }
}

@media (min-width: 1080px) {
  .auth-shell {
    padding: clamp(3rem, 6vw, 5rem) clamp(4rem, 9vw, 8rem);
  }

  .auth-card {
    border-radius: 32px;
    padding: clamp(2.8rem, 4vw, 3.4rem);
    gap: clamp(1.6rem, 2.5vw, 2.4rem);
  }
}
</style>
