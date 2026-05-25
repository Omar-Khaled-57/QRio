/**
 * useDB — IndexedDB persistence for saved QR codes.
 *
 * Uses the `idb` wrapper for a cleaner Promise-based API.
 * The store holds a list of `QRSaved` records keyed by an auto-incrementing id.
 *
 * @module useDB
 */

import { openDB, type IDBPDatabase } from 'idb'

interface QRSaved {
  id?: number
  label: string
  type: string
  config: string
  ts: string
}

/* ------------------------------------------------------------------ */
/*  Schema & connection                                                */
/* ------------------------------------------------------------------ */

const DB_NAME = 'qrio'
const STORE = 'library'
const VERSION = 2

let _db: IDBPDatabase | null = null

async function db(): Promise<IDBPDatabase> {
  if (_db) return _db
  _db = await openDB(DB_NAME, VERSION, {
    upgrade(d) {
      if (!d.objectStoreNames.contains(STORE)) {
        d.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    },
  })
  return _db
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** Return every saved QR record (newest first). */
export async function getLibrary(): Promise<QRSaved[]> {
  const items = await (await db()).getAll(STORE)
  return items.reverse()
}

/** Save a new QR record. */
export async function saveToLibrary(item: QRSaved): Promise<void> {
  await (await db()).add(STORE, item)
}

/** Delete one record by id. */
export async function deleteFromLibrary(id: number): Promise<void> {
  try {
    await (await db()).delete(STORE, id)
  } catch { /* ignore */ }
}

/** Delete every record from the library (used by "Clear All" in Settings). */
export async function clearLibrary(): Promise<void> {
  try {
    await (await db()).clear(STORE)
  } catch { /* ignore */ }
}

/** Replace the entire library (used when importing a JSON backup). */
export async function importLibrary(items: QRSaved[]): Promise<void> {
  try {
    const conn = await db()
    await conn.clear(STORE)
    for (const item of items) {
      await conn.add(STORE, item)
    }
  } catch { /* ignore */ }
}

/** Export every record as a plain array (for JSON download). */
export async function exportLibrary(): Promise<QRSaved[]> {
  try {
    return await (await db()).getAll(STORE)
  } catch {
    return []
  }
}

/**
 * Save an export snapshot (used for auto-save / quick-export).
 * This references the same store structure but accepts arbitrary metadata.
 */
export async function saveExport(_dataUrl: string, _meta: object): Promise<void> {
  // Placeholder — currently no-op; reserved for future auto-save feature.
}
