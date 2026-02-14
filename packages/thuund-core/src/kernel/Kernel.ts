import type { UIAdapter, LogicAdapter } from '@thuund/core'

export interface KernelOptions {
  ui: UIAdapter
  logic: LogicAdapter
}

export function createKernel(options: KernelOptions) {
  const { ui, logic } = options

  return {
    start() {
      logic.init?.()
      ui.mount?.(null)
    },

    stop() {
      ui.unmount?.()
      logic.dispose?.()
    },
  }
}
