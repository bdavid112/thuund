import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Kernel, KernelError } from '@thuund/core'

describe('Kernel Plugin Management', () => {
  let kernel: Kernel
  const mockAdapters = {
    ui: { init: vi.fn(), mount: vi.fn(), unmount: vi.fn(), getComponent: vi.fn() },
    logic: { init: vi.fn(), dispose: vi.fn(), getService: vi.fn() },
  }

  beforeEach(() => {
    kernel = new Kernel(mockAdapters)
  })

  // Grouping basic management to keep it lean
  describe('Inventory', () => {
    it('manages plugin registration and removal correctly', () => {
      const p1 = { name: 'P1' }
      const p2 = { name: 'P2' }

      kernel.registerPlugin(p1)
      kernel.registerPlugin(p2)
      expect(kernel.Plugins()).toHaveLength(2)

      kernel.deregisterPlugin(p1)
      expect(kernel.Plugins()).toEqual([p2])
    })
  })

  describe('Lifecycle Orchestration', () => {
    it('initializes plugins in registration order and provides kernel access', async () => {
      const executionOrder: string[] = []

      const createPlugin = (name: string) => ({
        name,
        init: vi.fn(async (k) => {
          executionOrder.push(name)
          expect(k).toBe(kernel) // Verify kernel injection
        }),
      })

      kernel.registerPlugin(createPlugin('Plugin A'))
      kernel.registerPlugin(createPlugin('Plugin B'))

      await kernel.start()

      // Verify the registration order is respected
      expect(executionOrder).toEqual(['Plugin A', 'Plugin B'])
    })

    it('executes dispose hooks during shutdown', async () => {
      const disposeMock = vi.fn()
      kernel.registerPlugin({ name: 'Disposable', dispose: disposeMock })

      await kernel.start()
      await kernel.stop()

      expect(disposeMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('State Guards', () => {
    // Parameterized test for state-related errors
    it.each([
      ['registerPlugin', (k: Kernel) => k.registerPlugin({ name: 'late' })],
      ['deregisterPlugin', (k: Kernel) => k.deregisterPlugin({ name: 'any' })],
    ])('prevents %s while the kernel is running', async (_, action) => {
      await kernel.start()
      expect(() => action(kernel)).toThrow(KernelError)
    })
  })
})
