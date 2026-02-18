import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Kernel, KernelError } from '@thuund/core'

describe('Kernel Advanced Lifecycle & Edge Cases', () => {
  let order: string[]

  // Helper to create tracked mocks that satisfy Promise<void>
  const trackedMock = (name: string, implementation?: () => Promise<void> | void) =>
    vi.fn(async () => {
      order.push(name)
      if (implementation) await implementation()
    })

  const createDefaultAdapters = () => ({
    ui: {
      init: trackedMock('ui.init'),
      mount: trackedMock('ui.mount'),
      unmount: trackedMock('ui.unmount'),
      getComponent: vi.fn(),
    },
    logic: {
      init: trackedMock('logic.init'),
      dispose: trackedMock('logic.dispose'),
      getService: vi.fn(),
    },
  })

  beforeEach(() => {
    order = []
  })

  it('stops immediately and wraps errors if a beforeStart hook fails', async () => {
    const kernel = new Kernel({
      ...createDefaultAdapters(),
      hooks: {
        beforeStart: async () => {
          throw new Error('Crashed at start')
        },
      },
    })

    await expect(kernel.start()).rejects.toThrow(KernelError)
    // Logic init should NEVER be reached if beforeStart fails
    expect(order).not.toContain('logic.init')
  })

  it('ensures plugins are initialized BEFORE the UI but AFTER logic', async () => {
    const kernel = new Kernel(createDefaultAdapters())

    kernel.registerPlugin({
      name: 'Order-Tester',
      init: trackedMock('plugin.init'),
    })

    await kernel.start()

    const pluginIndex = order.indexOf('plugin.init')
    const logicIndex = order.indexOf('logic.init')
    const uiInitIndex = order.indexOf('ui.init')

    expect(logicIndex).toBeLessThan(pluginIndex) // Logic first
    expect(pluginIndex).toBeLessThan(uiInitIndex) // Plugins second
  })

  it('prevents multiple start() calls to avoid double mounting', async () => {
    const kernel = new Kernel(createDefaultAdapters())
    await kernel.start()

    // Second call should fail because state is already 'running'
    await expect(kernel.start()).rejects.toThrow('An instance is already running')
  })

  it('calls the onError hook if a plugin fails to initialize', async () => {
    const errorHook = vi.fn()
    const pluginError = new Error('Plugin breakdown')
    const kernel = new Kernel({
      ...createDefaultAdapters(),
      hooks: { onError: errorHook },
    })

    kernel.registerPlugin({
      name: 'Broken-Plugin',
      init: async () => {
        throw pluginError
      },
    })

    await expect(kernel.start()).rejects.toThrow(KernelError)
    expect(errorHook).toHaveBeenCalledWith(pluginError)
  })

  it('executes cleanup in reverse order: Plugins -> UI -> Logic', async () => {
    const kernel = new Kernel(createDefaultAdapters())
    kernel.registerPlugin({
      name: 'Cleaner',
      dispose: trackedMock('plugin.dispose'),
    })

    await kernel.start()
    order = [] // Reset order to track stop sequence only
    await kernel.stop()

    expect(order).toEqual(['plugin.dispose', 'ui.unmount', 'logic.dispose'])
  })

  it('remains in idle state if start() fails', async () => {
    const kernel = new Kernel({
      ...createDefaultAdapters(),
      logic: {
        init: async () => {
          throw new Error()
        },
        dispose: vi.fn(),
      },
    })

    try {
      await kernel.start()
    } catch (e) {}

    // Should still allow plugin registration because it never successfully started
    expect(() => kernel.registerPlugin({ name: 'Recovery-Plugin' })).not.toThrow()
  })
})
