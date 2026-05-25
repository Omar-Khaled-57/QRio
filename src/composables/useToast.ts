/**
 * useToast — Lightweight toast notification system.
 *
 * Exposes a `toast(msg)` function that sets a reactive message,
 * shows it for 2.5 s, then auto-hides. The Toast.vue component
 * reads the shared refs and renders the notification overlay.
 *
 * @module useToast
 */

import { ref } from 'vue'

export const toastMsg = ref('')
export const toastShow = ref(false)

let _timer: ReturnType<typeof setTimeout> | null = null

/**
 * Show a brief toast notification.
 * Calling `toast()` while a previous toast is visible cancels
 * the old timer and replaces the message immediately.
 */
export function toast(msg: string) {
  if (_timer) clearTimeout(_timer)
  toastMsg.value = msg
  toastShow.value = false

  // Force a tick so the Transition component re-triggers
  void document.body.offsetWidth

  toastShow.value = true
  _timer = setTimeout(() => {
    toastShow.value = false
    _timer = null
  }, 2500)
}
