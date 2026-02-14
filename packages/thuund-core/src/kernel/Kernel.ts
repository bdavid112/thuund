import { UIAdapter, LogicAdapter, KernelError } from '@thuund/core'

export interface KernelOptions {
  ui: UIAdapter
  logic: LogicAdapter
}

export function createKernel(options: KernelOptions) {
  const { ui, logic } = options

  return {
    start() {
      try {
        logic.init?.()
      } catch (err) {
        console.error('[Kernel] LogicAdapter init failed:', err)
        throw new KernelError('Failed to initialize logic adapter', err)
      }

      try {
        ui.mount?.(null)
      } catch (err) {
        console.error('[Kernel] UIAdapter mount failed:', err)
        throw new KernelError('Failed to mount UI adapter', err)
      }
    },

    stop() {
      try {
        ui.unmount?.()
      } catch (err) {
        console.error('[Kernel] UIAdapter unmount failed:', err)
        throw new KernelError('Failed to unmount UI adapter', err)
      }

      try {
        logic.dispose?.()
      } catch (err) {
        console.error('[Kernel] LogicAdapter dispose failed:', err)
        throw new KernelError('Failed to dispose logic adapter', err)
      }
    },
  }
}
