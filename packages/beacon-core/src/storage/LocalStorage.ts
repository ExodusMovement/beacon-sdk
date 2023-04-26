import { Storage, StorageKey, StorageKeyReturnType, defaultValues } from '@exodus/airgap-beacon-types'

/**
 * @internalapi
 *
 * A storage that can be used in the browser
 */
export class LocalStorage implements Storage {
  constructor(private readonly prefix?: string) {}
  public static async isSupported(): Promise<boolean> {
    return Promise.resolve(Boolean(typeof window !== 'undefined') && Boolean(window.localStorage))
  }

  public async get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]> {
    const value = localStorage.getItem(this.getPrefixedKey(key))
    if (!value) {
      if (typeof defaultValues[key] === 'object') {
        return JSON.parse(JSON.stringify(defaultValues[key]))
      } else {
        return defaultValues[key]
      }
    } else {
      return JSON.parse(value)
    }
  }

  public async set<K extends StorageKey>(key: K, value: StorageKeyReturnType[K]): Promise<void> {
    return localStorage.setItem(this.getPrefixedKey(key), JSON.stringify(value))
  }

  public async delete<K extends StorageKey>(key: K): Promise<void> {
    return Promise.resolve(localStorage.removeItem(this.getPrefixedKey(key)))
  }

  private getPrefixedKey(key: string): string {
    return this.prefix ? `${this.prefix}-${key}` : key
  }
}
