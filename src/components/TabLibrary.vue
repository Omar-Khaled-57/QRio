<template>
  <div class="page">
    <div class="left-col">
      <div class="card">
        <div class="card-title">{{ t('l-saved') }}</div>
        <div v-if="items.length === 0" style="text-align:center;padding:32px 0;color:var(--muted);font-size:13px;font-weight:700">
          <div style="font-size:36px;margin-bottom:10px">📭</div>
          {{ t('l-emptylib') }}
        </div>
        <div v-else>
          <div
            v-for="(item, idx) in items"
            :key="item.id"
            class="history-item"
            @click="selectItem(item)"
          >
            <div class="history-thumb">
              <img v-if="thumbnails[item.id!]" :src="thumbnails[item.id!]" alt="" class="thumb-img" />
              <div v-else class="thumb-placeholder"></div>
            </div>
            <div class="history-info">
              <div class="history-title">{{ item.label }}</div>
              <div class="history-sub">{{ item.type }} · {{ item.ts }}</div>
            </div>
            <div class="history-acts">
              <div class="icon-btn" @click.stop="openInEditor(item)">✏️</div>
              <div class="icon-btn" @click.stop="deleteItem(item.id!)">🗑️</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="preview-col">
      <div class="preview-card" style="min-height:120px;align-items:flex-start">
        <div v-if="!selectedItem" style="font-size:13px;font-weight:700;color:var(--muted);text-align:center;width:100%;padding:24px 0">
          {{ t('l-selecthint') }}
        </div>
        <div v-else style="width:100%;text-align:center;padding:12px">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px">{{ selectedItem.label }}</div>
          <div style="opacity:.6;margin-bottom:12px">{{ selectedItem.type }} · {{ selectedItem.ts }}</div>
          <div class="action-row">
            <button class="btn btn-green" @click="openInEditor()">Open in Editor</button>
            <button class="btn btn-outline" @click="deleteItem(selectedItem.id!)">🗑️ Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { t } from '../composables/useI18n'
import { toast } from '../composables/useToast'
import { config as qrConfig, generateQRDataURL } from '../composables/useQR'
import { getLibrary, deleteFromLibrary } from '../composables/useDB'

interface LibItem {
  id?: number
  label: string
  type: string
  config: string
  ts: string
}

const emit = defineEmits<{ (e: 'navigate', tab: string): void }>()

const items = ref<LibItem[]>([])
const selectedItem = ref<LibItem | null>(null)
const thumbnails = ref<Record<number, string>>({})

async function generateThumb(item: LibItem) {
  try {
    const c = JSON.parse(item.config)
    const dataUrl = await generateQRDataURL(c.content || '', c.ecc || 'Q', c.qrColor || '#1a2e3b', c.bgColor || '#ffffff', 140)
    thumbnails.value[item.id!] = dataUrl
  } catch {
    // leave no thumbnail – placeholder shows
  }
}

async function load() {
  items.value = await getLibrary()
  await Promise.all(items.value.map(generateThumb))
}

async function deleteItem(id: number) {
  if (!window.confirm('Delete this item?')) return
  await deleteFromLibrary(id)
  if (selectedItem.value?.id === id) selectedItem.value = null
  await load()
  toast('🗑️ ' + t('toast-deleted'))
}

function selectItem(item: LibItem) {
  selectedItem.value = item
}

async function restoreItem() {
  if (!selectedItem.value) return
  try {
    const c = JSON.parse(selectedItem.value.config)
    qrConfig.value = { ...qrConfig.value, ...c }
    toast('👆 ' + selectedItem.value.label + ' ' + t('toast-selected'))
  } catch {
    toast('⚠️ Could not restore')
  }
}

async function openInEditor(item?: LibItem) {
  if (item) selectedItem.value = item
  if (!selectedItem.value) return
  await restoreItem()
  emit('navigate', 'create')
}

onMounted(load)
</script>

<style scoped>
.history-item {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px;
  border-radius: 13px;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color .15s;
}
.history-item:hover { border-color: var(--green); }
.history-thumb {
  width: 42px; height: 42px;
  border-radius: 8px;
  flex-shrink: 0;
  overflow: hidden;
}
.thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb-placeholder {
  width: 100%; height: 100%;
  background: repeating-conic-gradient(var(--muted) 0% 25%, #fff 0% 50%) 0 0 / 6px 6px;
}
.history-info { flex: 1; min-width: 0; }
.history-title { font-size: var(--fs-sm); font-weight: 800; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.history-sub { font-size: var(--fs-xs); color: var(--muted); font-weight: 600; margin-top: 2px; }
.history-acts { display: flex; gap: 6px; }
</style>
