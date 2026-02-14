import { describe, it, expect, vi } from 'vitest'
import { createKernel, KernelError } from '@thuund/core'

describe('Kernel error handling', () => {
  it('wraps errors from UIAdapter mount', () => {
    const kernel = createKernel({
      ui: {
        mount: () => {
          throw new Error('ui fail')
        },
        unmount: vi.fn(),
        update: vi.fn(),
      },
      logic: { init: vi.fn(), dispose: vi.fn() },
    })

    expect(() => kernel.start()).toThrow(KernelError)
  })

  it('wraps errors from LogicAdapter init', () => {
    const kernel = createKernel({
      ui: { mount: vi.fn(), unmount: vi.fn(), update: vi.fn() },
      logic: {
        init: () => {
          throw new Error('logic fail')
        },
        dispose: vi.fn(),
      },
    })

    expect(() => kernel.start()).toThrow(KernelError)
  })
})
