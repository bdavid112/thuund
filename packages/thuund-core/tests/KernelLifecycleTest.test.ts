import { describe, it, expect, vi } from 'vitest'
import { Kernel } from '@thuund/core'

describe('Kernel lifecycle', () => {
  it('calls mount on UIAdapter when started', async () => {
    const mountMock = vi.fn()

    const kernel = new Kernel({
      ui: {
        mount: mountMock,
        unmount: vi.fn(),
        update: () => {},
      },
      logic: {
        init: async () => {},
        dispose: async () => {},
      },
    })

    await kernel.start()

    expect(mountMock).toHaveBeenCalled()
  })

  it('calls init on LogicAdapter when started', async () => {
    const initMock = vi.fn()

    const kernel = new Kernel({
      ui: {
        mount: vi.fn(),
        unmount: vi.fn(),
        update: () => {},
      },
      logic: {
        init: initMock,
        dispose: async () => {},
      },
    })

    await kernel.start()

    expect(initMock).toHaveBeenCalled()
  })

  it('calls unmount on UIAdapter when finished', async () => {
    const unmountMock = vi.fn()

    const kernel = new Kernel({
      ui: {
        mount: vi.fn(),
        unmount: unmountMock,
        update: () => {},
      },
      logic: {
        init: async () => vi.fn(),
        dispose: async () => vi.fn(),
      },
    })

    await kernel.start()
    await kernel.stop()

    expect(unmountMock).toHaveBeenCalled()
  })

  it('calls dispose on LogicAdapter when finished', async () => {
    const disposeMock = vi.fn()

    const kernel = new Kernel({
      ui: {
        mount: vi.fn(),
        unmount: vi.fn(),
        update: () => {},
      },
      logic: {
        init: async () => vi.fn(),
        dispose: disposeMock,
      },
    })

    await kernel.start()
    await kernel.stop()

    expect(disposeMock).toHaveBeenCalled()
  })
})
