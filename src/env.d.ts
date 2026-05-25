/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'qrcode' {
  interface QRCodeModule {
    size: number
    get(row: number, col: number): boolean
  }
  interface QRCode {
    modules: QRCodeModule
  }
  interface CreateOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  }
  export function create(text: string, options?: CreateOptions): Promise<QRCode>
  export function toDataURL(text: string, options?: Record<string, any>): Promise<string>
  export default { create, toDataURL }
}
