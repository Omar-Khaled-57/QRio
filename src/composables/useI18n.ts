/**
 * useI18n — Minimal i18n for English / Arabic with LTR/RTL direction control.
 *
 * Strings are stored in a single `STR` map. The active language is persisted
 * to localStorage under `qrio_lang`. Every toggle updates the `<html>` element's
 * `dir` and `lang` attributes immediately so CSS logical properties reflow.
 *
 * @module useI18n
 */

import { ref } from 'vue'

/* ------------------------------------------------------------------ */
/*  Translation tables                                                 */
/* ------------------------------------------------------------------ */

/**
 * All UI strings keyed by language.
 * Keys use a short prefix convention:
 *   t-   tab / page title
 *   l-   label / section heading
 *   p-   QR type preset name
 *   f-   frame preset name
 *   lc-  colour channel label
 *   lg-  gradient label
 *   b-   button text
 *   ts-  toggle / preference description
 *   ts-*-s  toggle sub-description
 * toast-  toast notification text
 */
export const STR = {
  en: {
    dir: 'ltr', langBtn: 'العربية',
    't-create': 'Create', 't-library': 'Library', 't-settings': 'Settings',
    'l-qrtype': 'QR Type',
    'p-url': 'URL', 'p-wifi': 'Wi-Fi', 'p-vcard': 'vCard', 'p-email': 'Email',
    'p-location': 'Location', 'p-text': 'Text', 'p-sms': 'SMS', 'p-payment': 'Payment',
    'l-content': 'Content', 'l-urllabel': 'Website URL', 'l-namelabel': 'Label',
    'l-optional': '(optional)',
    'l-icon': 'Center Icon', 'l-uploadlabel': 'Upload image or logo', 'l-or': '— or pick one —',
    'l-frame': 'Frame / Container',
    'f-none': 'No Frame', 'f-scanme': 'Scan Me', 'f-coffee': 'Coffee',
    'f-badge': 'Dark Badge', 'f-menu': 'Menu', 'f-social': 'Social',
    'l-colors': 'Colors', 'lc-bg': 'Background', 'lc-qr': 'QR Dots', 'lc-frame': 'Frame',
    'lg-bg': 'Gradient', 'lg-qr': 'Gradient', 'lg-fr': 'Gradient',
    'l-adv': 'Advanced', 'l-ecc': 'Error Correction', 'l-size': 'Export Size', 'l-dots': 'Dot Style',
    'b-save': 'Save PNG', 'b-share': 'Share Link', 'b-copy': 'Copy', 'b-print': 'Print',
    'b-addlib': 'Save to Library',
    'l-saved': 'Saved QR Codes', 'l-emptylib': 'No saved QR codes yet.\nCreate one and click "Save to Library"!',
    'l-selecthint': 'Select a QR to preview',
    'l-prefs': 'Preferences',

    'ts-auto': 'Auto-save to Library', 'ts-auto-s': 'Save every QR you generate automatically',
    'ts-trans': 'Transparent Background', 'ts-trans-s': 'Export PNG with transparent background',
    'ts-margin': 'Include Quiet Zone', 'ts-margin-s': 'Add white border around the QR (recommended)',
    'l-storage': 'Local Storage', 'l-stored': 'Stored QR Codes',
    'l-stored-s': 'All data lives on your device only',
    'l-clear': 'Clear All Saved QRs',
    'l-export': 'Export & Import',
    'l-exportlib': 'Export Library', 'l-importlib': 'Import Library',
    'toast-saved': 'saved!', 'toast-deleted': 'Deleted', 'toast-copied': 'Copied!',
    'toast-exported': 'Library exported!', 'toast-imported': 'Library imported!',
    'toast-cleared': 'Library cleared!', 'toast-selected': 'selected',
  },
  ar: {
    dir: 'rtl', langBtn: 'English',
    't-create': 'إنشاء', 't-library': 'المكتبة', 't-settings': 'الإعدادات',
    'l-qrtype': 'نوع QR',
    'p-url': 'رابط', 'p-wifi': 'واي فاي', 'p-vcard': 'بطاقة', 'p-email': 'بريد',
    'p-location': 'موقع', 'p-text': 'نص', 'p-sms': 'SMS', 'p-payment': 'طريقة دفع',
    'l-content': 'المحتوى', 'l-urllabel': 'رابط الموقع', 'l-namelabel': 'التسمية',
    'l-optional': '(اختياري)',
    'l-icon': 'أيقونة المنتصف', 'l-uploadlabel': 'ارفع صورة أو شعار', 'l-or': '— أو اختر —',
    'l-frame': 'الإطار / الحاوية',
    'f-none': 'بدون إطار', 'f-scanme': 'امسح الكود', 'f-coffee': 'قهوة',
    'f-badge': 'شارة داكنة', 'f-menu': 'قائمة', 'f-social': 'سوشيال',
    'l-colors': 'الألوان', 'lc-bg': 'الخلفية', 'lc-qr': 'نقاط QR', 'lc-frame': 'الإطار',
    'lg-bg': 'تدرج', 'lg-qr': 'تدرج', 'lg-fr': 'تدرج',
    'l-adv': 'خيارات متقدمة', 'l-ecc': 'تصحيح الخطأ', 'l-size': 'حجم التصدير', 'l-dots': 'شكل النقاط',
    'b-save': 'حفظ PNG', 'b-share': 'مشاركة', 'b-copy': 'نسخ', 'b-print': 'طباعة',
    'b-addlib': 'حفظ في المكتبة',
    'l-saved': 'QR كودات محفوظة', 'l-emptylib': 'لا يوجد شيء هنا بعد.\nأنشئ كودًا واضغط "حفظ في المكتبة"!',
    'l-selecthint': 'اختر QR كود للمعاينة',
    'l-prefs': 'التفضيلات',

    'ts-auto': 'حفظ تلقائي للمكتبة', 'ts-auto-s': 'حفظ كل QR كود تنشئه تلقائيًا',
    'ts-trans': 'خلفية شفافة', 'ts-trans-s': 'تصدير PNG بخلفية شفافة',
    'ts-margin': 'تضمين المساحة الهادئة', 'ts-margin-s': 'إضافة حدود بيضاء حول الكود (موصى به)',
    'l-storage': 'التخزين المحلي', 'l-stored': 'QR كودات مخزنة',
    'l-stored-s': 'جميع البيانات محفوظة على جهازك فقط',
    'l-clear': 'مسح كل QR كودات المحفوظة',
    'l-export': 'تصدير واستيراد',
    'l-exportlib': 'تصدير المكتبة', 'l-importlib': 'استيراد المكتبة',
    'toast-saved': 'تم الحفظ!', 'toast-deleted': 'تم الحذف', 'toast-copied': 'تم النسخ!',
    'toast-exported': 'تم تصدير المكتبة!', 'toast-imported': 'تم استيراد المكتبة!',
    'toast-cleared': 'تم المسح!', 'toast-selected': 'تم التحديد',
  },
}

export type Lang = 'en' | 'ar'

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

const saved = (localStorage.getItem('qrio_lang') as Lang) || 'en'
export const lang = ref<Lang>(saved)

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Translate a key into the current language.
 * Returns the key itself if no translation is found (graceful fallback).
 */
export function t(key: string): string {
  const s = STR[lang.value] as Record<string, string>
  return s[key] ?? key
}

/** Toggle between English and Arabic, then apply direction/language attributes. */
export function toggleLang() {
  lang.value = lang.value === 'en' ? 'ar' : 'en'
  localStorage.setItem('qrio_lang', lang.value)
  applyLang()
}

/**
 * Set the `<html>` element's `dir` and `lang` attributes so CSS logical
 * properties and browser-level text direction respond immediately.
 */
export function applyLang() {
  const s = STR[lang.value]
  document.documentElement.setAttribute('dir', s.dir)
  document.documentElement.setAttribute('lang', lang.value)
}
