import { Kernel, LifecycleHooks } from '@thuund/core'

export interface Plugin {
  name: string
  init?: (kernel: Kernel) => void | Promise<void>
  dispose?: () => void | Promise<void>
  hooks?: Partial<LifecycleHooks>
}
