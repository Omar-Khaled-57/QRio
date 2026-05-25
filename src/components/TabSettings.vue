<template>
  <div class="page">
    <div class="left-col">
      <!-- Preferences -->
      <div class="card">
        <div class="card-title">{{ t('l-prefs') }}</div>

        <div v-for="pref in preferences" :key="pref.key" class="toggle-row">
          <div class="toggle-info">
            <div class="tl">{{ t('ts-' + pref.key) }}</div>
            <div class="ts">{{ t('ts-' + pref.key + '-s') }}</div>
          </div>
          <div class="toggle" :class="{ on: pref.get() }" @click="pref.toggle()"></div>
        </div>
      </div>

      <!-- Storage -->
      <div class="card">
        <div class="card-title">{{ t('l-storage') }}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--navy)">{{ t('l-stored') }}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">{{ t('l-stored-s') }}</div>
          </div>
          <div style="font-size:20px;font-weight:900;color:var(--green)">{{ storedCount }}</div>
        </div>
        <div class="sep"></div>
        <button class="btn btn-outline" style="width:100%;padding:11px;border-radius:12px;font-size:13px" @click="handleClear">
          🗑️ {{ t('l-clear') }}
        </button>
      </div>

      <!-- Export/Import -->
      <div class="card">
        <div class="card-title">{{ t('l-export') }}</div>
        <div class="action-row">
          <button class="btn btn-outline" style="padding:11px;border-radius:12px;font-size:13px" @click="handleExport">
            📦 {{ t('l-exportlib') }}
          </button>
          <button class="btn btn-outline" style="padding:11px;border-radius:12px;font-size:13px" @click="handleImport">
            📥 {{ t('l-importlib') }}
          </button>
        </div>
      </div>
    </div>
    <div class="preview-col"><!-- spacer --></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { t } from '../composables/useI18n'
import { toast } from '../composables/useToast'
import { config } from '../composables/useQR'
import { getLibrary, clearLibrary, exportLibrary, importLibrary } from '../composables/useDB'

const storedCount = ref(0)

const preferences = [
  {
    key: 'auto',
    get: () => config.value.autoSave,
    toggle: () => { config.value.autoSave = !config.value.autoSave },
  },
  {
    key: 'trans',
    get: () => config.value.transparent,
    toggle: () => { config.value.transparent = !config.value.transparent },
  },
  {
    key: 'margin',
    get: () => config.value.quietZone,
    toggle: () => { config.value.quietZone = !config.value.quietZone },
  },
]

async function handleClear() {
  await clearLibrary()
  storedCount.value = 0
  toast('🗑️ ' + t('toast-cleared'))
}

async function handleExport() {
  const data = await exportLibrary()
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'qrio-library.json'
  a.click()
  toast('📦 ' + t('toast-exported'))
}

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      await importLibrary(data)
      storedCount.value = (await getLibrary()).length
      toast('📥 ' + t('toast-imported'))
    } catch {
      toast('⚠️ Invalid file')
    }
  }
  input.click()
}

onMounted(async () => {
  storedCount.value = (await getLibrary()).length
})
</script>

<style scoped>
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
}
.toggle-row:last-child { border-bottom: none; }
.toggle-info .tl { font-size: var(--fs-sm); font-weight: 700; color: var(--navy); }
.toggle-info .ts { font-size: var(--fs-xs); color: var(--muted); margin-top: 2px; }
.toggle {
  width: 42px; height: 23px;
  background: var(--border);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: background .2s;
  flex-shrink: 0;
}
.toggle.on { background: var(--green); }
.toggle::after {
  content: '';
  position: absolute;
  width: 17px; height: 17px;
  background: white;
  border-radius: 50%;
  top: 3px; inset-inline-start: 3px;
  transition: transform .2s;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
}
.toggle.on::after { transform: translateX(19px); }
[dir="rtl"] .toggle.on::after { transform: translateX(-19px); }
</style>
