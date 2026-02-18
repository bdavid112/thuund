import { describe, it, expect, vi } from 'vitest'
import { Kernel, KernelError } from '@thuund/core'

describe('Kernel Error Wrapping', () => {
  const createMockAdapters = (overrides: any = {}) => ({
    ui: { init: vi.fn(), mount: vi.fn(), unmount: vi.fn(), ...overrides.ui },
    logic: { init: vi.fn(), dispose: vi.fn(), ...overrides.logic },
  })

  // Tests for the start() sequence
  it.each([
    [
      'LogicAdapter.init',
      {
        logic: {
          init: async () => {
            throw new Error()
          },
        },
      },
    ],
    [
      'UIAdapter.init',
      {
        ui: {
          init: async () => {
            throw new Error()
          },
        },
      },
    ],
    [
      'UIAdapter.mount',
      {
        ui: {
          mount: async () => {
            throw new Error()
          },
        },
      },
    ],
  ])('wraps errors from %s during start()', async (_, overrides) => {
    const kernel = new Kernel(createMockAdapters(overrides))
    await expect(kernel.start()).rejects.toThrow(KernelError)
  })

  // Tests for the stop() sequence
  it.each([
    [
      'UIAdapter.unmount',
      {
        ui: {
          unmount: async () => {
            throw new Error()
          },
        },
      },
    ],
    [
      'LogicAdapter.dispose',
      {
        logic: {
          dispose: async () => {
            throw new Error()
          },
        },
      },
    ],
  ])('wraps errors from %s during stop()', async (_, overrides) => {
    const kernel = new Kernel(createMockAdapters(overrides))

    // We must successfully start before we can test stop()
    await kernel.start()
    await expect(kernel.stop()).rejects.toThrow(KernelError)
  })
})
