import { describe, it, expect, vi } from 'vitest'
import { Kernel } from '@thuund/core'

describe('Kernel lifecycle orchestration', () => {
  it('follows the strict startup sequence: Logic -> Plugins -> UI', async () => {
    const sequence: string[] = []

    const logicMock = {
      init: vi.fn(async () => {
        sequence.push('logic-init')
      }),
      dispose: vi.fn(),
    }

    const uiMock = {
      init: vi.fn(async () => {
        sequence.push('ui-init')
      }),
      mount: vi.fn(async () => {
        sequence.push('ui-mount')
      }),
      unmount: vi.fn(),
    }

    const kernel = new Kernel({
      ui: uiMock,
      logic: logicMock,
      logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }, // Mock logger to avoid console spam
    })

    // Mock a plugin to check its position in the sequence
    kernel.registerPlugin({
      name: 'test-plugin',
      init: async () => {
        sequence.push('plugin-init')
      },
    })

    await kernel.start()

    // Verify the "Fullstack Symmetry" boot order
    expect(sequence).toEqual(['logic-init', 'plugin-init', 'ui-init', 'ui-mount'])
  })

  it('provides the Kernel instance to plugins during init', async () => {
    let capturedKernel = null

    const kernel = new Kernel({
      ui: { init: vi.fn(), mount: vi.fn(), unmount: vi.fn() },
      logic: { init: vi.fn(), dispose: vi.fn() },
    })

    kernel.registerPlugin({
      name: 'context-checker',
      init: async (k) => {
        capturedKernel = k
      },
    })

    await kernel.start()
    expect(capturedKernel).toBe(kernel)
  })

  it('prevents plugin registration after the kernel has started', async () => {
    const kernel = new Kernel({
      ui: { init: vi.fn(), mount: vi.fn(), unmount: vi.fn() },
      logic: { init: vi.fn(), dispose: vi.fn() },
    })

    await kernel.start()

    expect(() => {
      kernel.registerPlugin({ name: 'late-plugin' })
    }).toThrow('Cannot register plugin after kernel started')
  })

  it('gracefully shuts down in reverse order', async () => {
    const sequence: string[] = []

    const kernel = new Kernel({
      ui: {
        init: vi.fn(),
        mount: vi.fn(),
        unmount: vi.fn(async () => {
          sequence.push('ui-unmount')
        }),
      },
      logic: {
        init: vi.fn(),
        dispose: vi.fn(async () => {
          sequence.push('logic-dispose')
        }),
      },
    })

    kernel.registerPlugin({
      name: 'test-plugin',
      dispose: async () => {
        sequence.push('plugin-dispose')
      },
    })

    await kernel.start()
    await kernel.stop()

    // Plugins and UI should teardown before the core logic layer
    expect(sequence).toEqual(['plugin-dispose', 'ui-unmount', 'logic-dispose'])
  })
})
