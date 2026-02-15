import { describe, it, expect, vi } from 'vitest'
import { Kernel, KernelError } from '@thuund/core'

describe('Kernel logger', () => {
  it('calls logger.info on successful lifecycle events', async () => {
    const infoMock = vi.fn()

    const kernel = new Kernel({
      ui: {
        mount: vi.fn(),
        unmount: vi.fn(),
        update: () => {},
      },
      logic: {
        init: async () => vi.fn(),
        dispose: async () => vi.fn(),
      },
      logger: { info: infoMock, warn: vi.fn(), error: vi.fn() },
    })

    await kernel.start()
    await kernel.stop()

    expect(infoMock).toHaveBeenCalledTimes(4) // start+stop for UI and Logic
  })

  it('calls logger.error on failed lifecycle events', async () => {
    const errorMock = vi.fn()

    const kernel = new Kernel({
      ui: {
        mount: () => {
          throw new Error('Mount error')
        },
        unmount: vi.fn(),
        update: () => {},
      },
      logic: {
        init: async () => vi.fn(),
        dispose: async () => {
          throw new Error('Dispose error')
        },
      },
      logger: { info: vi.fn(), warn: vi.fn(), error: errorMock },
    })

    await expect(() => kernel.start()).rejects.toThrow(KernelError)
    await expect(() => kernel.stop()).rejects.toThrow(KernelError)
    expect(errorMock).toHaveBeenCalledTimes(2) // start+stop for UI and Logic
  })
})
