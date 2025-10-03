<template>
  <div
    class="dashboard"
    :class="{ 'dashboard--sidebar-open': isSidebarOpen }"
    :style="{ '--accent-color': accentColor }"
  >
    <aside class="sidebar">
      <button type="button" class="sidebar__close" @click="closeSidebar" aria-label="Tutup menu">
        <span />
        <span />
      </button>
      <div class="sidebar__brand">
        <div class="brand-icon">AMK</div>
        <div class="brand-info">
          <span class="brand-name">AMK Payroll</span>
          <span class="brand-tag">Terpercaya sejak 2020</span>
        </div>
      </div>
      <div class="sidebar__role">{{ role }}</div>
      <nav class="sidebar__menu">
        <button
          v-for="item in menuEntries"
          :key="item._key"
          type="button"
          class="menu-item"
          :class="{ active: item._key === currentMenuKey }"
          @click="() => selectMenu(item._key)"
        >
          <span class="menu-item__bullet" />
          <div class="menu-item__text">
            <span class="menu-item__label">{{ item.label }}</span>
            <span v-if="item.helper" class="menu-item__helper">{{ item.helper }}</span>
          </div>
        </button>
      </nav>
      <div class="sidebar__footer">
        <button type="button" class="sidebar__logout" @click="handleLogout">
          <span class="sidebar__logout-icon">⎋</span>
          <span>Keluar</span>
        </button>
        <div class="sidebar__support">
          <p>Ada kendala?</p>
          <a href="#">Hubungi tim kami</a>
        </div>
      </div>
    </aside>

    <div v-if="isSidebarOpen" class="sidebar-backdrop" @click="closeSidebar" />

    <main class="dashboard__main">
      <header class="dashboard__header">
        <button type="button" class="sidebar-toggle" @click="toggleSidebar" aria-label="Buka menu">
          <span />
          <span />
          <span />
        </button>
        <div>
          <p class="dashboard__greeting">{{ greeting }}</p>
          <h1>Selamat datang, {{ userName }}</h1>
        </div>
        <div class="dashboard__profile">
          <div class="profile-name">
            <span class="profile-label">Peran</span>
            <span class="profile-value">{{ role }}</span>
          </div>
          <div class="profile-avatar">{{ initials }}</div>
        </div>
      </header>

      <section v-if="summaryCards.length && isOverview" class="cards-grid">
        <article v-for="card in summaryCards" :key="card.title" class="summary-card">
          <div class="summary-card__icon" :style="{ '--card-color': card.accent || accentColor }">
            <span>{{ card.icon }}</span>
          </div>
          <div class="summary-card__body">
            <p class="summary-card__title">{{ card.title }}</p>
            <h2 class="summary-card__value">{{ card.value }}</h2>
            <p class="summary-card__meta" v-if="card.meta">{{ card.meta }}</p>
          </div>
        </article>
      </section>

      <section v-if="isOverview && $slots.overview" class="dashboard__slot">
        <slot name="overview" />
      </section>

      <section v-else-if="activeSlotName" class="dashboard__slot dashboard__slot--fill">
        <slot :name="activeSlotName" />
      </section>

      <div
        v-if="isOverview && (recentItems.length || (stats && stats.items && stats.items.length))"
        class="content-grid"
      >
        <section v-if="recentItems.length" class="recent-card">
          <div class="card-header">
            <div>
              <h2>{{ recentTitle }}</h2>
              <p>{{ recentSubtitle }}</p>
            </div>
            <button type="button">Lihat semua</button>
          </div>
          <ul class="recent-list">
            <li v-for="item in recentItems" :key="item.id || item.name" class="recent-item">
              <div class="recent-item__info">
                <span class="recent-item__name">{{ item.name }}</span>
                <span class="recent-item__desc">{{ item.description }}</span>
              </div>
              <div class="recent-item__meta">
                <span class="recent-item__amount">{{ item.amount }}</span>
                <span class="badge" :class="`badge--${item.status.tone}`">{{ item.status.label }}</span>
              </div>
            </li>
          </ul>
        </section>

        <section v-if="stats && stats.items && stats.items.length" class="stats-card">
          <div class="card-header">
            <div>
              <h2>{{ stats.title }}</h2>
              <p>{{ stats.subtitle }}</p>
            </div>
            <span class="stats-card__period">{{ stats.period }}</span>
          </div>

          <div class="stats-card__body">
            <div class="stats-card__chart" :style="progressStyle">
              <div class="stats-card__chart-inner">
                <span class="chart-value">{{ stats.total }}</span>
                <span class="chart-label">{{ stats.totalLabel }}</span>
              </div>
            </div>
            <ul class="stats-card__list">
              <li v-for="item in stats.items" :key="item.label">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </li>
            </ul>
          </div>

          <div v-if="quickActions.length" class="quick-actions">
            <h3>{{ quickActionsTitle }}</h3>
            <div class="quick-actions__grid">
              <article v-for="action in quickActions" :key="action.label" class="quick-action">
                <h4>{{ action.label }}</h4>
                <p>{{ action.description }}</p>
              </article>
            </div>
          </div>

          <footer class="stats-card__footer">
            <span>{{ stats.footer }}</span>
          </footer>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'

const props = defineProps({
  userName: { type: String, required: true },
  role: { type: String, required: true },
  greeting: { type: String, default: 'Semoga harimu menyenangkan! 👋' },
  menuItems: { type: Array, required: true },
  summaryCards: { type: Array, required: true },
  recentTitle: { type: String, default: 'Aktivitas terkini' },
  recentSubtitle: { type: String, default: 'Pantau update terbaru secara real-time.' },
  recentItems: { type: Array, default: () => [] },
  stats: {
    type: Object,
    required: true,
    default: () => ({})
  },
  quickActions: {
    type: Array,
    default: () => []
  },
  quickActionsTitle: { type: String, default: 'Aksi cepat' },
  accentColor: { type: String, default: '#1f3c88' },
  activeMenuKey: { type: String, default: '' },
  overviewKey: { type: String, default: '' }
})

const emit = defineEmits(['logout', 'update:activeMenuKey'])

const slots = useSlots()

const menuEntries = computed(() =>
  props.menuItems.map((item, index) => ({
    ...item,
    _key: item.key || item.id || item.value || item.label || `menu-${index}`
  }))
)

const internalActiveKey = ref('')

const fallbackKey = computed(() => menuEntries.value[0]?._key || '')

const currentMenuKey = computed({
  get() {
    return props.activeMenuKey || internalActiveKey.value || fallbackKey.value
  },
  set(value) {
    internalActiveKey.value = value
    emit('update:activeMenuKey', value)
  }
})

watch(
  () => props.activeMenuKey,
  (value) => {
    if (value) {
      internalActiveKey.value = value
    }
  }
)

watch(
  menuEntries,
  (entries) => {
    if (!entries.length) {
      internalActiveKey.value = ''
      return
    }
    const keys = entries.map((entry) => entry._key)
    if (!keys.includes(currentMenuKey.value)) {
      internalActiveKey.value = props.activeMenuKey || fallbackKey.value
    }
    if (!internalActiveKey.value) {
      internalActiveKey.value = fallbackKey.value
    }
  },
  { immediate: true }
)

const overviewKey = computed(() => props.overviewKey || fallbackKey.value)

const isOverview = computed(() => currentMenuKey.value === overviewKey.value)

const activeSlotName = computed(() => {
  if (isOverview.value) return ''
  if (currentMenuKey.value && slots[currentMenuKey.value]) {
    return currentMenuKey.value
  }
  if (slots.content) {
    return 'content'
  }
  return ''
})

const isSidebarOpen = ref(false)

const initials = computed(() => {
  return props.userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const selectMenu = (key) => {
  if (!key) return
  currentMenuKey.value = key
  closeSidebar()
}

const handleLogout = () => {
  emit('logout')
  closeSidebar()
}

const handleResize = () => {
  if (typeof window === 'undefined') return
  if (window.innerWidth >= 820) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', handleResize)
})

const progressStyle = computed(() => {
  const progress = Math.min(Math.max(props.stats.progress ?? 0.65, 0), 1)
  const degrees = `${Math.round(progress * 360)}deg`
  return {
    '--progress-deg': degrees,
    '--chart-color': props.stats.accent || props.accentColor
  }
})
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7ff 0%, #eef1ff 100%);
  color: #1b2142;
  position: relative;
}

.dashboard--sidebar-open {
  overflow: hidden;
}

.sidebar {
  background: linear-gradient(180deg, #0f1c3f 0%, #122358 60%, #101a43 100%);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: #ecf1ff;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 40;
}

.sidebar__close {
  display: none;
  margin-left: auto;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  flex-direction: column;
  gap: 4px;
}

.sidebar__close span {
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.7);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 18px;
  background: linear-gradient(135deg, var(--accent-color), rgba(99, 140, 255, 0.85));
  color: #fff;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-name {
  font-weight: 600;
  letter-spacing: 0.4px;
}

.brand-tag {
  font-size: 12px;
  color: rgba(236, 241, 255, 0.65);
}

.sidebar__role {
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(15, 28, 63, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  width: fit-content;
}

.sidebar__menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  color: inherit;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.2s ease, transform 0.2s ease;
  border: none;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.menu-item__bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
}

.menu-item.active .menu-item__bullet {
  background: #fff;
}

.menu-item__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-item__label {
  font-weight: 500;
}

.menu-item__helper {
  font-size: 12px;
  color: rgba(236, 241, 255, 0.6);
}

.sidebar__support {
  margin-top: auto;
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 16px;
  font-size: 13px;
}

.sidebar__support a {
  margin-top: 6px;
  display: inline-block;
  color: #9cb4ff;
}

.sidebar__footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar__logout {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(7, 15, 36, 0.45);
  color: #ecf1ff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  align-self: flex-start;
}

.sidebar__logout:hover {
  background: rgba(7, 15, 36, 0.65);
  transform: translateY(-1px);
}

.sidebar__logout-icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 14px;
  font-weight: 600;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 16, 35, 0.55);
  z-index: 30;
}

.dashboard__main {
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  position: relative;
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.dashboard__greeting {
  font-size: 15px;
  color: #6a7190;
  margin-bottom: 4px;
}

.sidebar-toggle {
  display: none;
  background: none;
  border: none;
  padding: 6px 4px;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.sidebar-toggle span {
  display: block;
  width: 24px;
  height: 3px;
  border-radius: 999px;
  background: #1b2142;
}

.dashboard__header h1 {
  font-size: 28px;
  font-weight: 600;
}

.dashboard__profile {
  display: flex;
  align-items: center;
  gap: 18px;
}

.profile-name {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.profile-label {
  font-size: 12px;
  color: #7f87aa;
  letter-spacing: 0.8px;
}

.profile-value {
  font-weight: 600;
  color: #1b2142;
}

.profile-avatar {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-color), rgba(95, 132, 250, 0.95));
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.dashboard__slot {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard__slot--fill {
  min-height: 0;
}

.summary-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 24px;
  display: flex;
  gap: 18px;
  align-items: center;
  box-shadow:
    0 18px 35px rgba(21, 36, 82, 0.06),
    0 3px 8px rgba(27, 33, 66, 0.04);
}

.summary-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--card-color), rgba(158, 184, 255, 0.9));
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 22px;
  font-weight: 600;
}

.summary-card__title {
  font-size: 14px;
  color: #767ca0;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.summary-card__value {
  font-size: 26px;
  font-weight: 600;
  color: #161c3f;
}

.summary-card__meta {
  font-size: 13px;
  color: #6f7592;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 24px;
}

.recent-card,
.stats-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 26px;
  box-shadow:
    0 24px 45px rgba(21, 36, 82, 0.08),
    0 4px 12px rgba(27, 33, 66, 0.05);
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.card-header p {
  font-size: 13px;
  color: #7f87aa;
}

.card-header button {
  border: none;
  background: rgba(31, 60, 136, 0.08);
  color: var(--accent-color);
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 14px;
  cursor: pointer;
}

.recent-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed rgba(23, 31, 74, 0.1);
}

.recent-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.recent-item__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-item__name {
  font-weight: 600;
  font-size: 16px;
}

.recent-item__desc {
  font-size: 13px;
  color: #8087a3;
}

.recent-item__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.recent-item__amount {
  font-weight: 600;
  color: #1f3c88;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.badge--success {
  background: rgba(54, 211, 153, 0.15);
  color: #1d9c6c;
}

.badge--warning {
  background: rgba(255, 193, 7, 0.18);
  color: #b88a00;
}

.badge--info {
  background: rgba(78, 125, 255, 0.18);
  color: #335ed7;
}

.badge--neutral {
  background: rgba(127, 135, 170, 0.15);
  color: #6d7394;
}

.stats-card__period {
  font-size: 13px;
  color: #7f87aa;
}

.stats-card__body {
  display: flex;
  gap: 24px;
}

.stats-card__chart {
  --progress-deg: 240deg;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(var(--chart-color) 0 var(--progress-deg), rgba(240, 243, 255, 0.8) var(--progress-deg) 360deg);
  display: grid;
  place-items: center;
  position: relative;
}

.stats-card__chart-inner {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: inset 0 2px 6px rgba(31, 60, 136, 0.08);
}

.chart-value {
  font-size: 20px;
  font-weight: 600;
  color: #1b2142;
}

.chart-label {
  font-size: 12px;
  color: #7f87aa;
  text-align: center;
}

.stats-card__list {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stats-card__list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.stats-card__list strong {
  color: #1f3c88;
  font-weight: 600;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.quick-actions h3 {
  font-size: 16px;
  font-weight: 600;
}

.quick-actions__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.quick-action {
  background: rgba(31, 60, 136, 0.06);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick-action h4 {
  font-size: 14px;
  font-weight: 600;
}

.quick-action p {
  font-size: 12px;
  color: #6b7395;
}

.stats-card__footer {
  font-size: 12px;
  color: #8b92b4;
  text-align: right;
}

@media (max-width: 1080px) {
  .dashboard {
    grid-template-columns: 240px 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-card__body {
    flex-direction: column;
    align-items: center;
  }

  .stats-card__list {
    width: 100%;
  }
}

@media (max-width: 820px) {
  .dashboard {
    grid-template-columns: 1fr;
    position: relative;
  }

  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(78vw, 320px);
    max-width: 340px;
    height: 100vh;
    transform: translateX(-100%);
    box-shadow: 18px 0 35px rgba(12, 18, 38, 0.35);
    padding: 28px 24px 32px;
    gap: 28px;
    border-right: none;
  }

  .dashboard--sidebar-open .sidebar {
    transform: translateX(0);
  }

  .sidebar__close {
    display: inline-flex;
  }

  .sidebar__footer {
    gap: 12px;
  }

  .sidebar__support {
    background: rgba(255, 255, 255, 0.04);
    padding: 14px;
  }

  .dashboard__main {
    padding: 28px 20px 36px;
  }

  .dashboard__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    position: relative;
  }

  .sidebar-toggle {
    display: inline-flex;
  }

  .recent-card,
  .stats-card {
    max-height: 65vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 640px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .dashboard__header h1 {
    font-size: 24px;
  }

  .profile-avatar {
    width: 42px;
    height: 42px;
  }

  .recent-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .recent-item__meta {
    align-items: center;
    flex-direction: row;
    gap: 12px;
  }

  .stats-card__body {
    align-items: stretch;
  }

  .quick-actions__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard__main {
    padding: 24px 16px 32px;
  }

  .summary-card {
    padding: 20px;
    border-radius: 18px;
  }

  .recent-card,
  .stats-card {
    padding: 20px;
    border-radius: 20px;
  }

  .card-header h2 {
    font-size: 18px;
  }

  .stats-card__chart {
    width: 180px;
    height: 180px;
  }
}
</style>
