<template>
  <div class="page">
    <div class="left-col">
      <!-- Name -->
      <div class="card">
        <div class="field" style="margin:0">
          <label>{{ t('l-namelabel') }} <span style="font-weight:400;opacity:.6">{{ t('l-optional') }}</span></label>
          <input v-model="cfg.label" :placeholder="'My QR Code'" />
        </div>
      </div>

      <!-- QR Type -->
      <div class="card">
        <div class="card-title">{{ t('l-qrtype') }}</div>
        <div class="pills">
          <div
            v-for="qrType in qrTypes"
            :key="qrType.id"
            class="pill"
            :class="{ active: cfg.type === qrType.id }"
            @click="cfg.type = qrType.id"
          >
            <span v-html="qrType.icon"></span>
            <span>{{ t('p-' + qrType.id) }}</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="card">
        <div class="card-title">{{ t('l-content') }}</div>
        <div class="field">
          <label>{{ contentLabel }}</label>
          <template v-if="cfg.type === 'wifi'">
            <input v-model="wifiSsid" :placeholder="t('l-urllabel')" />
            <input v-model="wifiPass" type="password" placeholder="Password" style="margin-top:8px" />
            <select v-model="wifiEnc" style="margin-top:8px;width:100%;border:1.5px solid var(--border);border-radius:11px;padding:10px 13px;font-family:inherit;font-size:14px;font-weight:600;color:var(--navy);background:var(--surface2);outline:none">
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </template>
          <template v-else-if="cfg.type === 'vcard'">
            <input v-model="vcardName" placeholder="Full Name" />
            <input v-model="vcardPhone" placeholder="Phone" style="margin-top:8px" />
            <input v-model="vcardEmail" placeholder="Email" style="margin-top:8px" />
          </template>
          <template v-else-if="cfg.type === 'email'">
            <input v-model="emailTo" placeholder="recipient@example.com" />
            <input v-model="emailSubject" placeholder="Subject" style="margin-top:8px" />
            <textarea v-model="emailBody" placeholder="Body" rows="3" style="margin-top:8px"></textarea>
          </template>
          <template v-else-if="cfg.type === 'sms'">
            <input v-model="smsNum" placeholder="Phone number" />
            <textarea v-model="smsBody" placeholder="Message" rows="2" style="margin-top:8px"></textarea>
          </template>
          <template v-else-if="cfg.type === 'location'">
            <input v-model="locLat" type="number" step="any" placeholder="Latitude" />
            <input v-model="locLng" type="number" step="any" placeholder="Longitude" style="margin-top:8px" />
          </template>
          <template v-else>
            <textarea
              v-model="cfg.content"
              :placeholder="cfg.type === 'url' ? 'https://example.com' : cfg.type === 'text' ? 'Enter text...' : cfg.type === 'payment' ? 'e.g. bitcoin:1A... or upi://pay...' : 'Enter content...'"
              rows="2"
              :style="{ 'font-family': cfg.type === 'payment' ? 'monospace' : 'inherit' }"
            ></textarea>
          </template>
        </div>
      </div>

      <!-- Center Icon -->
      <div class="card">
        <div class="card-title">{{ t('l-icon') }}</div>
        <div class="icon-upload">
          <input ref="fileInput" type="file" accept="image/*" @change="handleIconUpload" />
          <span style="font-size:18px">📁</span>&nbsp; {{ t('l-uploadlabel') }}
        </div>
        <div style="font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:9px">{{ t('l-or') }}</div>
        <div class="icon-presets">
            <div
              v-for="ic in iconPresets.filter(i => i !== 'none')"
              :key="ic"
              class="icon-p"
              :class="{ active: cfg.icon === ic, 'logo-preset': ic === '__logo__' }"
              @click="setIcon(ic)"
            >
              <svg v-if="ic === '__logo__'" viewBox="0 0 18 18" fill="none" style="width:20px;height:20px">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="white"/>
                <rect x="11" y="1" width="6" height="6" rx="1" fill="white"/>
                <rect x="1" y="11" width="6" height="6" rx="1" fill="white"/>
                <rect x="12" y="12" width="2" height="2" fill="white"/>
                <rect x="15" y="12" width="2" height="2" fill="white"/>
                <rect x="12" y="15" width="5" height="2" fill="white"/>
              </svg>
              <template v-else>{{ ic }}</template>
            </div>
            <div
              v-for="(url, idx) in uploadedIcons"
              :key="url"
              class="icon-p icon-uploaded"
              :class="{ active: cfg.iconImage === url }"
              @click="setUploadedIcon(url)"
            >
              <img :src="url" style="width:20px;height:20px;border-radius:4px;object-fit:cover" />
              <div class="icon-del" @click.stop="deleteUploadedIcon(idx)">✕</div>
            </div>
            <div
              class="icon-p"
              :class="{ active: cfg.icon === null && cfg.iconImage === null }"
              @click="setIcon('none')"
            >✕</div>
        </div>
        <div style="font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin:12px 0 6px">Icon Size</div>
        <div class="pills">
          <div
            v-for="sz in iconSizes"
            :key="sz"
            class="pill"
            :class="{ active: cfg.iconSize === sz }"
            @click="cfg.iconSize = sz"
          >{{ sz }}px</div>
        </div>
      </div>

      <!-- Frame -->
      <div class="card">
        <div class="card-title">{{ t('l-frame') }}</div>
        <div class="frames-grid">
          <div
            v-for="(frm, idx) in frames"
            :key="frm.key"
            class="frame-opt"
            :class="{ active: cfg.frame === frm.key }"
            @click="cfg.frame = frm.key"
          >
            <div class="fp" :style="frm.style">
              <div v-if="frm.topLabel" class="fp-label-top">{{ frm.topLabel }}</div>
              <img v-if="placeholderQR" :src="placeholderQR" class="qr-stub" :style="frm.stubStyle" />
              <div v-if="frm.botLabel" class="fp-label-bot">{{ frm.botLabel }}</div>
            </div>
            <div class="frame-label">{{ t('f-' + frm.key) }}</div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--muted);text-align:center;margin-top:8px">Coming soon: Couldn't find usable frames 😢</div>
      </div>

      <!-- Advanced -->
      <div class="card">
        <div class="card-title">{{ t('l-adv') }}</div>

        <div class="field">
          <label>{{ t('l-ecc') }}</label>
          <div class="pills">
            <div
              v-for="ecc in eccOptions"
              :key="ecc.val"
              class="pill"
              :class="{ active: cfg.ecc === ecc.val }"
              @click="cfg.ecc = ecc.val"
            >{{ ecc.label }}</div>
          </div>
        </div>
        <div class="sep"></div>
        <div class="field">
          <label>{{ t('l-size') }}</label>
          <div class="pills">
            <div
              v-for="sz in sizeOptions"
              :key="sz.val"
              class="pill"
              :class="{ active: cfg.exportSize === sz.val }"
              @click="cfg.exportSize = sz.val"
            >{{ sz.label }}</div>
          </div>
        </div>
        <div class="sep"></div>
        <div class="field">
          <label>{{ t('l-dots') }}</label>
          <div class="pills">
            <div
              v-for="dot in dotOptions"
              :key="dot.val"
              class="pill"
              :class="{ active: cfg.dotStyle === dot.val }"
              @click="cfg.dotStyle = dot.val"
            >{{ dot.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="preview-col">
      <PreviewPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { config, type QrType, type FrameKey, type EccLevel, type DotStyle, type ExportSize, generateQRDataURL } from '../composables/useQR'
import { t } from '../composables/useI18n'
import { toast } from '../composables/useToast'
import PreviewPanel from './PreviewPanel.vue'

const cfg = config
const placeholderQR = ref('')

onMounted(async () => {
  try { placeholderQR.value = await generateQRDataURL('https://qrio.vercel.app', 'Q', '#1a2e3b', '#ffffff', 120) } catch {}
})

const qrTypes = [
  { id: 'url' as QrType, icon: '🔗' },
  { id: 'wifi' as QrType, icon: '📶' },
  { id: 'vcard' as QrType, icon: '👤' },
  { id: 'email' as QrType, icon: '📧' },
  { id: 'location' as QrType, icon: '📍' },
  { id: 'text' as QrType, icon: '📝' },
  { id: 'sms' as QrType, icon: '📱' },
  { id: 'payment' as QrType, icon: '💳' },
]

const iconPresets = ['__logo__', '☕', '🌿', '🔗', '📍', '💳', '🎵', '🛒', '❤️', '🎁', '📞', '🍽️', 'none']
const iconSizes = [24, 32, 40, 48, 56]
const uploadedIcons = ref<string[]>([])

const ICON_STORAGE_KEY = 'qrio-uploaded-icons'

function loadUploadedIcons(): string[] {
  try { return JSON.parse(localStorage.getItem(ICON_STORAGE_KEY) || '[]') } catch { return [] }
}

function saveUploadedIcons() {
  try { localStorage.setItem(ICON_STORAGE_KEY, JSON.stringify(uploadedIcons.value)) }
  catch { toast('⚠️ Could not save icons to storage') }
}

uploadedIcons.value = loadUploadedIcons()

function handleIconUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  if (f.size > 2 * 1024 * 1024) { toast('⚠️ Image must be under 2MB'); input.value = ''; return }
  if (uploadedIcons.value.length >= 10) { toast('⚠️ Max 10 custom icons'); input.value = ''; return }
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result as string
    uploadedIcons.value.push(dataUrl)
    saveUploadedIcons()
    cfg.value.icon = null
    cfg.value.iconImage = dataUrl
  }
  reader.readAsDataURL(f)
  input.value = ''
}

function setUploadedIcon(url: string) {
  cfg.value.icon = null
  cfg.value.iconImage = url
}

function deleteUploadedIcon(idx: number) {
  uploadedIcons.value.splice(idx, 1)
  saveUploadedIcons()
  const active = cfg.value.iconImage
  if (active && !uploadedIcons.value.includes(active)) {
    cfg.value.icon = null
    cfg.value.iconImage = null
  }
}

function setIcon(val: string) {
  if (val === 'none') {
    cfg.value.icon = null
    cfg.value.iconImage = null
  } else {
    cfg.value.icon = val
    cfg.value.iconImage = null
  }
}

// Reactive helper for multi-field types
const wifiSsid = ref('')
const wifiPass = ref('')
const wifiEnc = ref('WPA')
const vcardName = ref('')
const vcardPhone = ref('')
const vcardEmail = ref('')
const emailTo = ref('')
const emailSubject = ref('')
const emailBody = ref('')
const smsNum = ref('')
const smsBody = ref('')
const locLat = ref('')
const locLng = ref('')

const contentLabel = computed(() => {
  const map: Record<string, string> = {
    url: 'Website URL',
    wifi: 'Wi-Fi Name (SSID)',
    vcard: 'Name',
    email: 'Email To',
    sms: 'Phone Number',
    location: 'Latitude',
    text: 'Text Content',
    payment: 'Payment Data',
  }
  return map[cfg.value.type] || 'Content'
})

// Sync multi-field types into cfg.content
watch([wifiSsid, wifiPass, wifiEnc], () => {
  if (cfg.value.type === 'wifi') cfg.value.content = [wifiSsid.value, wifiPass.value, wifiEnc.value].join('\n')
})
watch([vcardName, vcardPhone, vcardEmail], () => {
  if (cfg.value.type === 'vcard') cfg.value.content = [vcardName.value, vcardPhone.value, vcardEmail.value].join('\n')
})
watch([emailTo, emailSubject, emailBody], () => {
  if (cfg.value.type === 'email') cfg.value.content = [emailTo.value, emailSubject.value, emailBody.value].join('\n')
})
watch([smsNum, smsBody], () => {
  if (cfg.value.type === 'sms') cfg.value.content = [smsNum.value, smsBody.value].join('\n')
})
watch([locLat, locLng], () => {
  if (cfg.value.type === 'location') cfg.value.content = [locLat.value, locLng.value].join('\n')
})

// Frame definitions
const frames = [
  {
    key: 'none' as FrameKey,
    style: { background: 'var(--surface2)' },
    topLabel: null, botLabel: null,
    stubStyle: {},
  },
  {
    key: 'scan-me' as FrameKey,
    style: { background: '#e6f9ef', flexDirection: 'column' as const, justifyContent: 'space-between' as const, padding: '5px' },
    topLabel: 'SCAN ME',
    botLabel: null,
    stubStyle: { width: '48%', margin: '4px auto 0' },
  },
  {
    key: 'coffee' as FrameKey,
    style: { background: '#fff9e6', flexDirection: 'column' as const, justifyContent: 'center' as const, gap: '4px', padding: '5px' },
    topLabel: '☕ ORDER HERE',
    botLabel: null,
    stubStyle: { width: '48%', margin: '0 auto' },
  },
  {
    key: 'badge' as FrameKey,
    style: { background: '#1a2e3b', flexDirection: 'column' as const, justifyContent: 'center' as const, gap: '4px', padding: '5px', borderRadius: '7px' },
    topLabel: null,
    botLabel: 'SCAN THIS →',
    stubStyle: { width: '48%', margin: '0 auto' },
  },
  {
    key: 'menu' as FrameKey,
    style: { background: '#fff', border: '1.5px solid #f7c948', flexDirection: 'column' as const, justifyContent: 'center' as const, gap: '4px', padding: '5px' },
    topLabel: '📋 MENU',
    botLabel: null,
    stubStyle: { width: '48%', margin: '0 auto' },
  },
  {
    key: 'social' as FrameKey,
    style: { background: 'linear-gradient(135deg,#e6f9ef,#e0f8f5)', flexDirection: 'column' as const, justifyContent: 'center' as const, gap: '4px', padding: '5px' },
    topLabel: null,
    botLabel: 'FOLLOW ME ✦',
    stubStyle: { width: '48%', margin: '0 auto' },
  },
]

const eccOptions = [
  { val: 'L' as EccLevel, label: 'L – 7%' },
  { val: 'M' as EccLevel, label: 'M – 15%' },
  { val: 'Q' as EccLevel, label: 'Q – 25%' },
  { val: 'H' as EccLevel, label: 'H – 30%' },
]

const sizeOptions = [
  { val: 512 as ExportSize, label: '512 px' },
  { val: 1024 as ExportSize, label: '1024 px' },
  { val: 2048 as ExportSize, label: '2048 px' },
]

const dotOptions = [
  { val: 'square' as DotStyle, label: '■ Square' },
  { val: 'round' as DotStyle, label: '● Round' },
  { val: 'diamond' as DotStyle, label: '◆ Diamond' },
  { val: 'hex' as DotStyle, label: '⬡ Hex' },
]



</script>

<style scoped>
.frames-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}
.frame-opt {
  border: 2px solid var(--border);
  border-radius: 13px;
  background: var(--surface2);
  padding: 9px 8px 7px;
  cursor: pointer;
  text-align: center;
  transition: all .16s;
}
.frame-opt:hover, .frame-opt.active {
  border-color: var(--green);
  background: var(--green-glow);
}
.fp {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  position: relative;
  overflow: hidden;
}
.fp-label-top, .fp-label-bot {
  font-size: var(--fs-tiny);
  font-weight: 900;
  letter-spacing: .06em;
}
.fp-label-top { color: #28a860; }
.fp-label-bot { color: #28a860; }
.qr-stub {
  width: 52%;
  height: auto;
  aspect-ratio: 1;
  border-radius: 3px;
  object-fit: contain;
}
.frame-label {
  font-size: var(--fs-tiny);
  font-weight: 800;
  color: var(--slate);
  letter-spacing: .03em;
}

.icon-upload {
  width: 100%;
  border: 2px dashed var(--green);
  border-radius: 13px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  color: var(--green-dark);
  font-size: var(--fs-sm);
  font-weight: 700;
  background: var(--green-glow);
  transition: background .15s;
  position: relative;
  margin-bottom: 12px;
}
[data-theme="dark"] .icon-upload { color: var(--green); }
.icon-upload:hover { background: rgba(61,201,122,.28); }
.icon-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.icon-presets { display: flex; flex-wrap: wrap; gap: 7px; }
.icon-p {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--fs-md);
  cursor: pointer;
  transition: all .15s;
  user-select: none;
}
.icon-p.active, .icon-p:hover {
  border-color: var(--green);
  background: var(--green-glow);
  transform: scale(1.1);
}
.icon-p.logo-preset {
  background: var(--green);
}
.icon-p.logo-preset:hover {
  background: var(--green-dark);
}
.icon-uploaded { position: relative; }
.icon-del {
  position: absolute;
  inset-block-start: -5px; inset-inline-end: -5px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--green);
  color: white;
  font-size: var(--fs-tiny);
  font-weight: 800;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
}
.icon-uploaded:hover .icon-del { display: flex; }
.icon-del:hover { transform: scale(1.15); }

</style>
