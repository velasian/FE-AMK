<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
  pageTitle: {
    type: String,
    default: '',
  },
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['logout'])

const route = useRoute()
const isExpanded = ref(false)
const isMobile = ref(false)

const isCollapsed = computed(() => !isExpanded.value && !isMobile.value)

const showLabels = computed(() => (isMobile.value ? isExpanded.value : !isCollapsed.value))

function toggleSidebar() {
  if (isMobile.value) {
    isExpanded.value = !isExpanded.value
    return
  }

  isExpanded.value = !isExpanded.value
}

function closeSidebarOnMobile() {
  if (isMobile.value) {
    isExpanded.value = false
  }
}

function handleResize() {
  isMobile.value = window.innerWidth < 992

  if (!isMobile.value && isExpanded.value === false) {
    // Keep the sidebar collapsed on desktop by default
    isExpanded.value = false
  }

  if (isMobile.value) {
    isExpanded.value = false
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => route.fullPath,
  () => {
    closeSidebarOnMobile()
  },
)
</script>

<template>
  <div class="dashboard-shell">
    <aside
      :class="[
        'dashboard-sidebar',
        { 'dashboard-sidebar--expanded': isExpanded, 'dashboard-sidebar--collapsed': isCollapsed },
      ]"
    >
      <div class="sidebar-content">
        <div class="sidebar-brand">
          <div class="brand-logo">AMK</div>
          <div v-if="showLabels" class="brand-text">
            <span class="brand-title">Portal</span>
            <span class="brand-subtitle">3.0</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <RouterLink
            v-for="item in menuItems"
            :key="item.label"
            :to="item.to"
            class="sidebar-link"
            :class="{ 'sidebar-link--active': route.name === item.to.name }"
          >
            <component :is="item.icon" class="sidebar-icon" aria-hidden="true" />
            <span v-if="showLabels" class="sidebar-label">{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>
    </aside>

    <div class="dashboard-main">
      <header class="dashboard-topbar">
        <button type="button" class="menu-toggle" @click="toggleSidebar" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="topbar-heading">
          <h1>{{ pageTitle }}</h1>
          <p>Selamat datang kembali, {{ user.name }}!</p>
        </div>
        <div class="topbar-controls">
          <label class="topbar-search">
            <span class="sr-only">Cari</span>
            <input type="search" placeholder="Cari di dashboard" />
          </label>
          <button type="button" class="pill-button" aria-label="Ganti bahasa">ID</button>
        </div>
        <div class="topbar-user">
          <div class="user-initials">{{ user.name?.charAt(0) }}</div>
          <div class="user-meta">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-role">{{ user.role }}</span>
          </div>
          <button type="button" class="logout-button" @click="emit('logout')">Keluar</button>
        </div>
      </header>

      <main class="dashboard-content">
        <div class="content-container">
          <slot />
        </div>
      </main>
    </div>

    <transition name="overlay">
      <div
        v-if="isMobile && isExpanded"
        class="mobile-overlay"
        role="presentation"
        @click="toggleSidebar"
      ></div>
    </transition>
  </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  display: flex;
  background: radial-gradient(circle at 12% 18%, rgba(59, 130, 246, 0.18), transparent 55%),
    radial-gradient(circle at 88% 12%, rgba(14, 116, 144, 0.22), transparent 60%),
    linear-gradient(180deg, #030a1c 0%, #05102a 100%);
  color: #f5f7ff;
  position: relative;
}

.dashboard-sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(165deg, rgba(25, 52, 112, 0.85), rgba(37, 74, 156, 0.68));
  border-right: 1px solid rgba(148, 163, 255, 0.2);
  backdrop-filter: blur(28px);
  transition: width 0.35s ease, transform 0.35s ease;
  width: 78px;
  z-index: 20;
  overflow: hidden;
  box-shadow: 10px 0 40px rgba(5, 16, 42, 0.45);
}

.dashboard-sidebar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(200deg, rgba(79, 70, 229, 0.35), transparent 60%);
  pointer-events: none;
}

.dashboard-sidebar--expanded {
  width: 268px;
}

.dashboard-sidebar--collapsed {
  width: 78px;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.4rem;
  gap: 2.4rem;
  position: relative;
  z-index: 1;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1.15rem;
  color: #0b1330;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.brand-title {
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brand-subtitle {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  opacity: 0.7;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 1.05rem;
  padding: 0.85rem 1rem;
  border-radius: 18px;
  color: inherit;
  text-decoration: none;
  transition: background 0.35s ease, color 0.35s ease, border 0.35s ease;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(148, 163, 255, 0.35);
}

.sidebar-link--active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(139, 92, 246, 0.9));
  border-color: transparent;
  box-shadow: 0 18px 36px rgba(59, 130, 246, 0.35);
}

.sidebar-icon {
  width: 22px;
  height: 22px;
}

.sidebar-label {
  font-size: 0.95rem;
}

.dashboard-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 2.2rem 2.4rem;
  gap: 1.8rem;
  color: #0b1330;
  position: relative;
}

.dashboard-main::before,
.dashboard-main::after {
  content: '';
  position: absolute;
  border-radius: 40%;
  filter: blur(120px);
  z-index: 0;
  opacity: 0.6;
}

.dashboard-main::before {
  width: 360px;
  height: 360px;
  background: rgba(59, 130, 246, 0.25);
  top: -120px;
  right: 15%;
}

.dashboard-main::after {
  width: 420px;
  height: 420px;
  background: rgba(34, 211, 238, 0.18);
  bottom: -160px;
  left: 10%;
}

.dashboard-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  background: rgba(248, 250, 255, 0.95);
  border-radius: 28px;
  padding: 1.25rem 1.85rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 35px 60px -25px rgba(5, 16, 42, 0.55);
  position: sticky;
  top: 2.2rem;
  z-index: 5;
}

.menu-toggle {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(226, 232, 255, 0.9), rgba(203, 213, 255, 0.6));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.25s ease, border 0.25s ease, box-shadow 0.25s ease;
}

.menu-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 999px;
  background: #1e293b;
}

.menu-toggle:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 12px 20px rgba(59, 130, 246, 0.25);
}

.topbar-heading {
  flex: 1;
}

.topbar-heading h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: #111e46;
}

.topbar-heading p {
  margin: 0.45rem 0 0;
  color: rgba(15, 23, 42, 0.65);
  font-size: 0.95rem;
}

.topbar-controls {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.topbar-search {
  display: inline-flex;
  align-items: center;
  background: rgba(226, 232, 255, 0.6);
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.topbar-search input {
  border: none;
  background: transparent;
  width: 180px;
  font-size: 0.9rem;
  color: #0f172a;
}

.topbar-search input::placeholder {
  color: rgba(15, 23, 42, 0.55);
}

.topbar-search input:focus {
  outline: none;
}

.topbar-search:focus-within {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.pill-button {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 0.95rem;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(99, 102, 241, 0.9));
  color: #f8fbff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pill-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 20px rgba(79, 70, 229, 0.3);
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-initials {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.92), rgba(14, 165, 233, 0.82));
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #f8fbff;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.user-name {
  font-weight: 600;
  color: #0f172a;
}

.user-role {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(30, 41, 59, 0.55);
}

.logout-button {
  border: none;
  border-radius: 14px;
  padding: 0.55rem 1.1rem;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.12);
  color: rgba(185, 28, 28, 0.88);
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.22);
  color: rgba(220, 38, 38, 0.95);
  transform: translateY(-1px);
}

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.content-container {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 15, 40, 0.55);
  backdrop-filter: blur(4px);
  z-index: 15;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

@media (max-width: 1280px) {
  .dashboard-main {
    padding: 2rem 1.8rem;
  }

  .dashboard-topbar {
    top: 1.8rem;
  }
}

@media (max-width: 1100px) {
  .topbar-controls {
    gap: 0.6rem;
  }

  .topbar-search input {
    width: 140px;
  }
}

@media (max-width: 992px) {
  .dashboard-shell {
    flex-direction: column;
  }

  .dashboard-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    height: 100vh;
    transform: translateX(-100%);
    width: 260px;
    border-right: 1px solid rgba(148, 163, 255, 0.35);
    border-radius: 0 28px 28px 0;
    box-shadow: 0 28px 65px rgba(2, 6, 23, 0.55);
  }

  .dashboard-sidebar--expanded {
    transform: translateX(0);
  }

  .dashboard-main {
    padding: 1.4rem 1.1rem 2rem;
  }

  .dashboard-topbar {
    position: static;
    border-radius: 24px;
  }

  .topbar-controls {
    width: 100%;
    justify-content: space-between;
  }

  .topbar-search {
    flex: 1;
  }

  .topbar-search input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .dashboard-topbar {
    flex-direction: column;
    align-items: stretch;
    gap: 1.25rem;
  }

  .topbar-heading {
    text-align: left;
  }

  .topbar-controls {
    order: 3;
    gap: 0.75rem;
  }

  .pill-button {
    align-self: flex-start;
  }

  .topbar-user {
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  .dashboard-main {
    padding: 1.1rem 0.9rem 1.6rem;
  }

  .dashboard-topbar {
    padding: 1rem 1.1rem;
  }

  .content-container {
    width: 100%;
  }

  .menu-toggle {
    width: 46px;
    height: 46px;
  }

  .topbar-heading h1 {
    font-size: 1.35rem;
  }

  .logout-button {
    padding: 0.5rem 0.95rem;
  }
}
</style>
