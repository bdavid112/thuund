import { AdapterMap, KernelError } from '@thuund/core'

export class AdapterRegistry {
  private adapters: Partial<AdapterMap> = {}

  public constructor(initial: AdapterMap) {
    this.adapters = { ...initial }
  }

  public get<K extends keyof AdapterMap>(key: K): AdapterMap[K] {
    const adapter = this.adapters[key]
    if (!adapter) throw new KernelError(`Adapter "${key}" not registered`)
    return adapter
  }

  public set<K extends keyof AdapterMap>(key: K, adapter: AdapterMap[K]) {
    this.adapters[key] = adapter
  }

  public has<K extends keyof AdapterMap>(key: K): boolean {
    return key in this.adapters
  }
}
