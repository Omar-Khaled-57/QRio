<template>
  <nav class="navbar">
      <div class="logo" @click="goCreate">
        <div class="logo-icon">
          <svg viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="white"/>
            <rect x="11" y="1" width="6" height="6" rx="1" fill="white"/>
            <rect x="1" y="11" width="6" height="6" rx="1" fill="white"/>
            <rect x="12" y="12" width="2" height="2" fill="white"/>
            <rect x="15" y="12" width="2" height="2" fill="white"/>
            <rect x="12" y="15" width="5" height="2" fill="white"/>
          </svg>
        </div>
        QRio
      </div>

    <div class="nav-center" :class="{ open: menuOpen }">
      <div class="nav-links">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-link"
          :class="{ active: tabId === tab.id }"
          @click="selectTab(tab.id)"
        >
          <span v-html="tab.icon"></span>
          <span>{{ t('t-' + tab.id) }}</span>
        </div>
      </div>

      <div class="navbar-right">
        <button class="theme-btn" @click="toggleTheme" :title="theme === 'light' ? 'Dark mode' : 'Light mode'">

          <svg v-if="theme === 'light'" viewBox="0 0 20 20" fill="none" style="width:18px;height:18px">
            <circle cx="10" cy="10" r="3.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.6 4.6l1 1M14.4 14.4l1 1M4.6 15.4l1-1M14.4 5.6l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else viewBox="0 0 20 20" style="width:18px;height:18px">
            <defs><mask id="moon-mask"><rect width="20" height="20" fill="white"/><circle cx="13" cy="10" r="5" fill="black"/></mask></defs>
            <circle cx="9" cy="10" r="6" fill="var(--green)" mask="url(#moon-mask)"/>
          </svg>
        </button>
        <button class="lang-btn" @click="toggleLang">{{ STR[lang].langBtn }}</button>
      </div>
    </div>

    <button class="hamburger" @click="menuOpen = !menuOpen" :aria-label="menuOpen ? 'Close menu' : 'Open menu'">
      <svg viewBox="0 0 20 20" fill="none" style="width:20px;height:20px">
        <line v-if="!menuOpen" x1="3" y1="6" x2="17" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line v-if="!menuOpen" x1="3" y1="10" x2="17" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line v-if="!menuOpen" x1="3" y1="14" x2="17" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line v-if="menuOpen" x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line v-if="menuOpen" x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { t, lang, toggleLang, applyLang, STR } from '../composables/useI18n'
import { theme, toggleTheme } from '../composables/useTheme'

const props = defineProps<{ tabId: string }>()
const emit = defineEmits<{ 'update:tabId': [id: string] }>()

const menuOpen = ref(false)

function selectTab(id: string) {
  menuOpen.value = false
  emit('update:tabId', id)
}

function goCreate() {
  selectTab('create')
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

const tabs = [
  { id: 'create', icon: '✦' },
  { id: 'library', icon: '⊞' },
  { id: 'settings', icon: '⚙' },
]

applyLang()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 200;
  background: var(--topbar-bg);
  border-bottom: 1.5px solid var(--topbar-border);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  padding: 0 clamp(12px, 3vw, 20px);
  height: 58px;
  gap: 4px;
  transition: background .25s, border-color .25s;
}
@media (min-width: 761px) {
  .navbar { padding: 25px 10vw; border-radius: 0 0 16px 16px; }
}
.logo {
  font-size: var(--fs-md);
  font-weight: 900;
  color: var(--green);
  display: flex;
  align-items: center;
  gap: 7px;
  margin-inline-end: 18px;
  white-space: nowrap;
  flex-shrink: 0;
}
.logo-icon {
  width: 30px; height: 30px;
  background: var(--green);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.logo-icon svg { width: 18px; height: 18px; }
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}
.nav-link {
  padding: 7px 14px;
  border-radius: 10px;
  font-size: var(--fs-sm);
  font-weight: 800;
  color: var(--muted);
  cursor: pointer;
  transition: background .15s, color .15s;
  white-space: nowrap;
  user-select: none;
  display: flex; align-items: center; gap: 5px;
}
.nav-link:hover { background: var(--surface2); color: var(--slate); }
.nav-link.active { background: var(--green-glow); color: var(--green-dark); }
[data-theme="dark"] .nav-link.active { color: var(--green); }
.nav-center {
  display: contents;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-inline-start: auto;
  flex-shrink: 0;
}
.theme-btn {
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--surface2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--fs-md);
  transition: all .18s;
  flex-shrink: 0;
}
.theme-btn:hover { border-color: var(--green); background: var(--green-glow); }
.lang-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--surface2);
  color: var(--slate);
  font-family: 'Cairo', var(--font), sans-serif;
  font-size: var(--fs-sm);
  font-weight: 800;
  cursor: pointer;
  transition: all .18s;
  white-space: nowrap;
}
.lang-btn:hover { border-color: var(--green); color: var(--green-dark); background: var(--green-glow); }

.hamburger {
  display: none;
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--surface2);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--slate);
  flex-shrink: 0;
  transition: all .18s;
}
.hamburger:hover { border-color: var(--green); color: var(--green-dark); background: var(--green-glow); }

@media (max-width: 760px) {
  .navbar { justify-content: space-between; padding: 0 5vw; }
  .hamburger { display: flex; }
  .nav-center {
    display: flex;
    position: fixed;
    inset-block-start: 58px; inset-inline: 0;
    background: var(--topbar-bg);
    border-bottom: 1.5px solid var(--topbar-border);
    padding: 12px 16px 16px;
    flex-direction: column;
    gap: 12px;
    box-shadow: var(--shadow-md);
    z-index: 199;
    clip-path: inset(0 0 100% 0);
    transition: clip-path .35s ease;
    pointer-events: none;
  }
  .nav-center.open {
    clip-path: inset(0);
    pointer-events: auto;
  }
  .nav-center .nav-links {
    flex-direction: column;
    width: 100%;
  }
  .nav-center .nav-link {
    width: 100%;
    padding: 10px 14px;
  }
  .nav-center .navbar-right {
    margin-inline-start: 0;
    width: 100%;
    justify-content: stretch;
  }
  .nav-center .navbar-right .theme-btn,
  .nav-center .navbar-right .lang-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
