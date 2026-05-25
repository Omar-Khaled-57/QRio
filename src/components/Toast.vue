<template>
  <Transition name="toast">
    <div v-if="toastShow" class="toast">{{ toastMsg }}</div>
  </Transition>
</template>

<script setup lang="ts">
import { toastMsg, toastShow } from '../composables/useToast'
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--navy);
  color: var(--bg);
  padding: 11px 22px;
  border-radius: 30px;
  font-size: var(--fs-sm);
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0,0,0,.2);
  z-index: 999;
  pointer-events: none;
  white-space: nowrap;
}
.toast-enter-active {
  transition: transform .32s cubic-bezier(.34,1.56,.64,1), opacity .2s;
}
.toast-leave-active {
  transition: opacity .2s;
}
.toast-enter-from {
  transform: translateX(-50%) translateY(90px);
  opacity: 0;
}
.toast-leave-to {
  opacity: 0;
}
</style>
