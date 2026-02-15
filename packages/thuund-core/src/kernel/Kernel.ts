import { UIAdapter, LogicAdapter, Logger, KernelError } from '@thuund/core'
import { LifecycleHooks } from './LifecycleHooks'

export interface KernelOptions {
  ui: UIAdapter
  logic: LogicAdapter
  logger?: Logger
  hooks?: LifecycleHooks
}

export class Kernel {
  private ui: UIAdapter
  private logic: LogicAdapter
  private logger?: Logger
  private hooks: LifecycleHooks

  constructor(options: KernelOptions) {
    this.ui = options.ui
    this.logic = options.logic
    this.logger = options.logger
    this.hooks = options.hooks || {}
  }

  async start() {
    try {
      this.logger?.info('[KERNEL] Initialization started')

      await this.hooks.beforeStart?.()
      await this.logic.init?.()
      await this.ui.mount?.(null)
      await this.hooks.afterStart?.()

      this.logger?.info('[KERNEL] Initialization successful')
    } catch (err) {
      await this.hooks.onError?.(err)
      this.logger?.error('[KERNEL] Initialization failed', err)
      throw new KernelError('An error occured')
    }
  }

  async stop() {
    try {
      this.logger?.info('[KERNEL] Kernel stopping')

      await this.hooks.beforeStop?.()
      await this.ui.unmount?.()
      await this.logic.dispose?.()
      await this.hooks.afterStop?.()

      this.logger?.info('[KERNEL] Kernel stopped gracefully')
    } catch (err) {
      await this.hooks.onError?.(err)
      this.logger?.error('[KERNEL] Kernel could not stop gracefully')
      throw new KernelError('An error occured')
    }
  }
}
