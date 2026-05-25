/**
 * useTheme — Light / dark theme toggle persisted to localStorage.
 *
 * On init, reads the saved preference (or falls back to the system
 * preference via `prefers-color-scheme`). A `<body>` attribute
 * `data-theme="dark"` / `data-theme="light"` is kept in sync so CSS
 * custom properties can respond.
 *
 * @module useTheme
 */

import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const saved = (localStorage.getItem('qrio_theme') as Theme)
  || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export const theme = ref<Theme>(saved)

/** Apply the active theme to `<body>` and persist to localStorage. */
function applyTheme() {
  document.body.setAttribute('data-theme', theme.value)
  localStorage.setItem('qrio_theme', theme.value)
}

/** Toggle between light and dark. */
export function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// Sync the DOM whenever the ref changes
watch(theme, applyTheme, { immediate: true })
