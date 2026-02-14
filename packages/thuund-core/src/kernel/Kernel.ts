import { UIAdapter, LogicAdapter, KernelError, Logger } from '@thuund/core'

export interface KernelOptions {
  ui: UIAdapter
  logic: LogicAdapter
  logger?: Logger
}

export function createKernel(options: KernelOptions) {
  const { ui, logic, logger } = options

  return {
    start() {
      try {
        logic.init?.()
        logger?.info('LogicAdapter initialized')
      } catch (err) {
        logger?.error('LogicAdapter init failed', err)
        throw new KernelError('Failed to initialize logic adapter', err)
      }

      try {
        ui.mount?.(null)
        logger?.info('UIAdapter mounted')
      } catch (err) {
        logger?.error('UIAdapter mount failed', err)
        throw new KernelError('Failed to mount UI adapter', err)
      }
    },

    stop() {
      try {
        ui.unmount?.()
        logger?.info('UIAdapter unmounted')
      } catch (err) {
        logger?.error('UIAdapter unmount failed', err)
        throw new KernelError('Failed to unmount UI adapter', err)
      }

      try {
        logic.dispose?.()
        logger?.info('LogicAdapter disposed')
      } catch (err) {
        logger?.error('LogicAdapter dispose failed', err)
        throw new KernelError('Failed to dispose logic adapter', err)
      }
    },
  }
}
