import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Kernel, KernelError, UIAdapter, LogicAdapter, AdapterRegistry } from '@thuund/core'

describe('AdapterRegistry integration in Kernel', () => {
  let kernel: Kernel
  let mockUI: UIAdapter
  let mockLogic: LogicAdapter

  beforeEach(() => {
    mockUI = {
      init: vi.fn(async () => {}),
      mount: vi.fn(async () => {}),
      unmount: vi.fn(async () => {}),
    }

    mockLogic = {
      init: vi.fn(async () => {}),
      dispose: vi.fn(async () => {}),
    }

    kernel = new Kernel({
      ui: mockUI,
      logic: mockLogic,
    })
  })

  it('returns the default adapters via getAdapter', () => {
    const ui = kernel.getAdapter('ui')
    const logic = kernel.getAdapter('logic')

    expect(ui).toBe(mockUI)
    expect(logic).toBe(mockLogic)
  })

  it('allows replacing adapters while kernel is idle', () => {
    const newUI: UIAdapter = {
      init: vi.fn(async () => {}),
      mount: vi.fn(async () => {}),
      unmount: vi.fn(async () => {}),
    }

    const newLogic: LogicAdapter = {
      init: vi.fn(async () => {}),
      dispose: vi.fn(async () => {}),
    }

    kernel.setAdapter('ui', newUI)
    kernel.setAdapter('logic', newLogic)

    expect(kernel.getAdapter('ui')).toBe(newUI)
    expect(kernel.getAdapter('logic')).toBe(newLogic)
  })

  it('throws if trying to replace adapter while running', async () => {
    await kernel.start()

    const newUI: UIAdapter = {
      init: vi.fn(async () => {}),
      mount: vi.fn(async () => {}),
      unmount: vi.fn(async () => {}),
    }

    expect(() => kernel.setAdapter('ui', newUI)).toThrow(KernelError)
  })

  it('throws if requesting an adapter that does not exist', () => {
    // TypeScript ensures 'ui' and 'logic' exist, so simulate a missing key manually
    const registry = new AdapterRegistry({ ui: mockUI, logic: mockLogic })
    // @ts-ignore
    expect(() => registry.get('nonexistent')).toThrow(KernelError)
  })
})
