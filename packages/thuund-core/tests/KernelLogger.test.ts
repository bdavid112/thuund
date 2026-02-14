import { describe, it, expect, vi } from 'vitest'
import { createKernel, KernelError } from '@thuund/core'

describe('Kernel logger', () => {
  it('calls logger.info on successful lifecycle events', () => {
    const infoMock = vi.fn()
    const kernel = createKernel({
      ui: { mount: vi.fn(), unmount: vi.fn(), update: vi.fn() },
      logic: { init: vi.fn(), dispose: vi.fn() },
      logger: { info: infoMock, warn: vi.fn(), error: vi.fn() },
    })

    kernel.start()
    kernel.stop()

    expect(infoMock).toHaveBeenCalledTimes(4) // start+stop for UI and Logic
  })

  it('calls logger.error on failed lifecycle events', () => {
    const errorMock = vi.fn()
    const kernel = createKernel({
      ui: {
        mount: () => {
          throw new Error('Mount error')
        },
        unmount: vi.fn(),
        update: vi.fn(),
      },
      logic: {
        init: vi.fn(),
        dispose: () => {
          throw new Error('Dispose error')
        },
      },
      logger: { info: vi.fn(), warn: vi.fn(), error: errorMock },
    })

    expect(() => kernel.start()).toThrow(KernelError)
    expect(() => kernel.stop()).toThrow(KernelError)
    expect(errorMock).toHaveBeenCalledTimes(2) // start+stop for UI and Logic
  })
})
