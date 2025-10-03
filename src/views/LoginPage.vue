<template>
  <div class="page">
    <div class="background-gradient"></div>
    <div class="background-accent background-accent--one"></div>
    <div class="background-accent background-accent--two"></div>

    <section class="login-card" aria-labelledby="login-title">
      <header class="login-card__header">
        <img src="@/assets/amk-logo.svg" alt="Logo AMK" class="login-card__logo" />
        <h1 id="login-title">AMK Portal</h1>
        <p class="login-card__subtitle">Masuk untuk mengelola akun dan nikmati pengalaman terbaik.</p>
      </header>

      <form class="login-form">
        <label class="login-form__field">
          <span>Email</span>
          <input type="email" placeholder="nama@email.com" autocomplete="email" />
        </label>

        <label class="login-form__field">
          <span>Kata Sandi</span>
          <div class="password-input">
            <input type="password" placeholder="••••••••" autocomplete="current-password" />
            <button type="button" class="password-input__toggle" aria-label="Tampilkan kata sandi">Lihat</button>
          </div>
        </label>

        <div class="login-form__actions">
          <label class="remember">
            <input type="checkbox" />
            <span>Ingat saya</span>
          </label>
          <a href="#" class="link">Lupa kata sandi?</a>
        </div>

        <button type="submit" class="button button--primary">Masuk</button>
        <p class="login-form__help">Butuh bantuan? Hubungi admin</p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 3vw, 3rem);
  background: linear-gradient(160deg, #071f3d 0%, #0b2c59 45%, #154e8a 100%);
  overflow: hidden;
}

.background-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.12), transparent 45%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1), transparent 55%),
    radial-gradient(circle at bottom, rgba(21, 78, 138, 0.35), transparent 60%);
  opacity: 0.85;
}

.background-accent {
  position: absolute;
  width: clamp(180px, 32vw, 340px);
  height: clamp(180px, 32vw, 340px);
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  z-index: 1;
}

.background-accent--one {
  top: clamp(-80px, -6vw, -40px);
  right: clamp(-60px, -8vw, -20px);
  background: rgba(255, 255, 255, 0.22);
}

.background-accent--two {
  bottom: clamp(-90px, -8vw, -30px);
  left: clamp(-90px, -8vw, -30px);
  background: rgba(36, 126, 214, 0.45);
}

.login-card {
  position: relative;
  z-index: 2;
  width: min(420px, 100%);
  padding: clamp(2rem, 4vw, 3rem);
  background: linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%);
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(3, 15, 32, 0.35);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.25rem);
}

.login-card__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.login-card__logo {
  width: clamp(60px, 14vw, 88px);
  height: auto;
}

.login-card__header h1 {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  color: #0a2245;
  letter-spacing: -0.02em;
}

.login-card__subtitle {
  color: rgba(9, 35, 70, 0.75);
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: rgba(9, 35, 70, 0.78);
  font-size: 0.95rem;
}

.login-form__field input[type='email'],
.login-form__field input[type='password'] {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(9, 35, 70, 0.12);
  background-color: rgba(255, 255, 255, 0.9);
  color: #091f3a;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-form__field input[type='email']:focus,
.login-form__field input[type='password']:focus {
  outline: none;
  border-color: rgba(21, 78, 138, 0.5);
  box-shadow: 0 0 0 4px rgba(21, 78, 138, 0.15);
}

.password-input {
  position: relative;
  display: flex;
}

.password-input input {
  flex: 1;
}

.password-input__toggle {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: rgba(9, 35, 70, 0.6);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
}

.login-form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
}

.remember {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(9, 35, 70, 0.75);
}

.remember input {
  width: 1rem;
  height: 1rem;
  accent-color: #154e8a;
}

.button {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.95rem 1.5rem;
  border-radius: 16px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button--primary {
  background: linear-gradient(135deg, #0b2c59 0%, #154e8a 100%);
  color: #ffffff;
  box-shadow: 0 18px 40px rgba(11, 44, 89, 0.35);
}

.button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 48px rgba(11, 44, 89, 0.4);
}

.button--primary:active {
  transform: translateY(0);
  box-shadow: 0 12px 24px rgba(11, 44, 89, 0.3);
}

.login-form__help {
  text-align: center;
  color: rgba(9, 35, 70, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

.link {
  color: #154e8a;
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .page {
    padding: 2rem;
  }

  .login-card {
    padding: 2.25rem;
  }
}

@media (max-width: 640px) {
  .page {
    padding: 1.5rem;
  }

  .background-accent {
    width: clamp(140px, 40vw, 220px);
    height: clamp(140px, 40vw, 220px);
    filter: blur(45px);
  }

  .login-card {
    padding: 1.85rem;
    border-radius: 20px;
    gap: 1.5rem;
  }

  .login-card__subtitle {
    font-size: 0.9rem;
  }

  .login-form__actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .button {
    padding: 0.85rem 1.25rem;
    border-radius: 14px;
  }
}

@media (max-width: 420px) {
  .page {
    padding: 1.25rem;
  }

  .login-card {
    padding: 1.65rem;
  }

  .login-card__header h1 {
    font-size: 1.65rem;
  }

  .login-card__subtitle {
    font-size: 0.85rem;
  }

  .login-form__field span {
    font-size: 0.85rem;
  }

  .login-form__field input[type='email'],
  .login-form__field input[type='password'] {
    padding: 0.8rem 0.9rem;
    font-size: 0.95rem;
  }

  .password-input__toggle {
    right: 0.6rem;
    font-size: 0.8rem;
  }

  .remember span,
  .login-form__help,
  .link,
  .login-form__actions {
    font-size: 0.85rem;
  }
}
</style>
