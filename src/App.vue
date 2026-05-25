<template>
  <NavBar :tab-id="tab" @update:tab-id="tab = $event" />

  <TabCreate v-if="tab === 'create'" />
  <TabLibrary v-else-if="tab === 'library'" @navigate="tab = $event" />
  <TabSettings v-else-if="tab === 'settings'" />

  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { applyLang } from './composables/useI18n'
import { config } from './composables/useQR'
import { saveToLibrary } from './composables/useDB'
import NavBar from './components/NavBar.vue'
import TabCreate from './components/TabCreate.vue'
import TabLibrary from './components/TabLibrary.vue'
import TabSettings from './components/TabSettings.vue'
import Toast from './components/Toast.vue'

const tab = ref('create')
applyLang()

onMounted(() => {
  window.addEventListener('beforeunload', () => {
    if (!config.value.autoSave) return
    try {
      saveToLibrary({
        label: config.value.label || 'QR #' + Date.now(),
        type: config.value.type,
        config: JSON.stringify(config.value),
        ts: new Date().toLocaleDateString(),
      })
    } catch { /* background save */ }
  })
})
</script>

<style></style>
