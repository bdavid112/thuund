import { UIAdapter, LogicAdapter, Logger, KernelError, LifecycleHooks } from '@thuund/core'
import { Plugin } from '../plugins/Plugin'

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
  private plugins: Plugin[]
  private state: 'idle' | 'running' = 'idle'

  public Plugins = (): Plugin[] => {
    return this.plugins
  }

  constructor(options: KernelOptions) {
    this.ui = options.ui
    this.logic = options.logic
    this.logger = options.logger
    this.hooks = options.hooks || {}
    this.plugins = []
  }

  async start() {
    try {
      this.logger?.info('[KERNEL] Initialization started')

      await this.hooks.beforeStart?.()

      await this.logic.init?.()
      await this.ui.mount?.(null)
      await this.initPlugins()

      await this.hooks.afterStart?.()
      this.state = 'running'

      this.logger?.info('[KERNEL] Initialization successful')
    } catch (err) {
      await this.hooks.onError?.(err)
      this.logger?.error('[KERNEL] Initialization failed', err)
      throw new KernelError('An error occured while initializing')
    }
  }

  async stop() {
    try {
      this.logger?.info('[KERNEL] Kernel stopping')

      await this.hooks.beforeStop?.()

      await this.disposePlugins()
      await this.ui.unmount?.()
      await this.logic.dispose?.()

      await this.hooks.afterStop?.()
      this.state = 'idle'

      this.logger?.info('[KERNEL] Kernel stopped gracefully')
    } catch (err) {
      await this.hooks.onError?.(err)
      this.logger?.error('[KERNEL] Kernel could not stop gracefully')
      throw new KernelError('An error occured')
    }
  }

  registerPlugin(plugin: Plugin) {
    if (this.state !== 'idle') {
      const error = new KernelError(`Cannot register plugin after kernel started`)
      this.logger?.error('[KERNEL] Plugin registration failed', error)
      throw error
    }

    this.logger?.info(`[KERNEL] Registering plugin: ${plugin.name}`)
    this.plugins.push(plugin)
    this.logger?.info(`[KERNEL] Plugin ${plugin.name} registered successfully`)
  }

  deregisterPlugin(plugin: Plugin) {
    if (this.state !== 'idle') {
      const error = new KernelError(`Cannot deregister plugin after kernel started`)
      this.logger?.error('[KERNEL] Plugin deregistration failed', error)
      throw error
    }

    this.logger?.info(`[KERNEL] Deregistering plugin: ${plugin.name}`)
    this.plugins = this.plugins.filter((p) => p.name != plugin.name)
    this.logger?.info(`[KERNEL] Plugin ${plugin.name} registered successfully`)
  }

  private async initPlugins() {
    for (const plugin of this.plugins) {
      await plugin.init?.(this)
    }
  }

  private async disposePlugins() {
    for (const plugin of this.plugins) {
      await plugin.dispose?.()
    }
  }
}
