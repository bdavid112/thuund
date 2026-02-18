import {
  UIAdapter,
  LogicAdapter,
  Logger,
  KernelError,
  LifecycleHooks,
  AdapterRegistry,
  AdapterMap,
} from '@thuund/core'
import { Plugin } from '../plugins/Plugin'

export interface KernelOptions {
  ui: UIAdapter
  logic: LogicAdapter
  logger?: Logger
  hooks?: LifecycleHooks
}

export class Kernel {
  private logger?: Logger
  private hooks: LifecycleHooks
  private plugins: Plugin[]
  private registry: AdapterRegistry
  private state: 'idle' | 'running' = 'idle'

  public Plugins = (): Plugin[] => {
    return this.plugins
  }

  public constructor(options: KernelOptions) {
    this.logger = options.logger
    this.hooks = options.hooks || {}
    this.plugins = []
    this.registry = new AdapterRegistry({
      ui: options.ui,
      logic: options.logic,
    })
  }

  public async start() {
    if (this.state != 'idle') throw new KernelError('An instance is already running')
    try {
      this.logger?.info('[KERNEL] Starting...')
      await this.hooks.beforeStart?.()

      /* Init */
      await this.getAdapter('logic').init()
      await this.initPlugins()
      await this.getAdapter('ui').init(null)

      /* UI mount */
      await this.getAdapter('ui').mount(null)

      await this.hooks.afterStart?.()
      this.state = 'running'

      this.logger?.info('[KERNEL] Bootstrapped successfully')
    } catch (err) {
      await this.hooks.onError?.(err)
      this.logger?.error('[KERNEL] Boot failure', err)
      throw new KernelError('Failed to start Thuund')
    }
  }

  public async stop() {
    try {
      this.logger?.info('[KERNEL] Stopping...')

      await this.hooks.beforeStop?.()

      await this.disposePlugins()
      await this.getAdapter('ui').unmount?.()
      await this.getAdapter('logic').dispose?.()

      await this.hooks.afterStop?.()
      this.state = 'idle'

      this.logger?.info('[KERNEL] Stopped gracefully')
    } catch (err) {
      await this.hooks.onError?.(err)
      this.logger?.error('[KERNEL] Shutdown failure')
      throw new KernelError('Failed to gracefully stop Thuund')
    }
  }

  public registerPlugin(plugin: Plugin) {
    if (this.state !== 'idle') {
      const error = new KernelError(`Cannot register plugin after kernel started`)
      this.logger?.error('[KERNEL] Plugin registration failed', error)
      throw error
    }

    this.logger?.info(`[KERNEL] Registering plugin: ${plugin.name}`)
    this.plugins.push(plugin)
    this.logger?.info(`[KERNEL] Plugin ${plugin.name} registered successfully`)
  }

  public deregisterPlugin(plugin: Plugin) {
    if (this.state !== 'idle') {
      const error = new KernelError(`Cannot deregister plugin after kernel started`)
      this.logger?.error('[KERNEL] Plugin deregistration failed', error)
      throw error
    }

    this.logger?.info(`[KERNEL] Deregistering plugin: ${plugin.name}`)
    this.plugins = this.plugins.filter((p) => p.name != plugin.name)
    this.logger?.info(`[KERNEL] Plugin ${plugin.name} registered successfully`)
  }

  public getAdapter<K extends keyof AdapterMap>(key: K) {
    return this.registry.get(key)
  }

  public setAdapter<K extends keyof AdapterMap>(key: K, adapter: AdapterMap[K]) {
    if (this.state != 'idle') throw new KernelError('[KERNEL] Can not set adapter while running')
    this.registry.set(key, adapter)
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
