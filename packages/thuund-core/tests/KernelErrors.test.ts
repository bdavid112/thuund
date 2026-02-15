import { describe, it, expect, vi } from 'vitest'
import { Kernel, KernelError } from '@thuund/core'

describe('Kernel error handling', () => {
  it('wraps errors from UIAdapter mount', () => {
    const kernel = new Kernel({
      ui: {
        mount: async () => {
          throw new Error('Mount error')
        },
        unmount: async () => vi.fn(),
        update: () => {},
      },
      logic: {
        init: async () => vi.fn(),
        dispose: async () => vi.fn(),
      },
    })

    expect(() => kernel.start()).rejects.toThrow(KernelError)
  })

  it('wraps errors from LogicAdapter dispose', async () => {
    const kernel = new Kernel({
      ui: {
        mount: async () => vi.fn(),
        unmount: async () => vi.fn(),
        update: () => {},
      },
      logic: {
        init: async () => vi.fn(),
        dispose: async () => {
          throw new Error('Dispose error')
        },
      },
    })

    await kernel.start()

    expect(() => kernel.stop()).rejects.toThrow(KernelError)
  })
})
