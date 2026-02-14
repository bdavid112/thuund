import { describe, it, expect, vi } from 'vitest'
import { createKernel } from '@thuund/core'

describe('Kernel lifecycle', () => {
  it('calls mount on UIAdapter when started', () => {
    const mountMock = vi.fn()

    const kernel = createKernel({
      ui: {
        mount: mountMock,
        unmount: vi.fn(),
        update: vi.fn(),
      },
      logic: {
        init: vi.fn(),
        dispose: vi.fn(),
      },
    })

    kernel.start()
    kernel.stop()

    expect(mountMock).toHaveBeenCalled()
  })

  it('calls init on LogicAdapter when started', () => {
    const initMock = vi.fn()

    const kernel = createKernel({
      ui: {
        mount: vi.fn(),
        unmount: vi.fn(),
        update: vi.fn(),
      },
      logic: {
        init: initMock,
        dispose: vi.fn(),
      },
    })

    kernel.start()
    kernel.stop()

    expect(initMock).toHaveBeenCalled()
  })

  it('calls unmount on UIAdapter when finished', () => {
    const unmountMock = vi.fn()

    const kernel = createKernel({
      ui: {
        mount: vi.fn(),
        unmount: unmountMock,
        update: vi.fn(),
      },
      logic: {
        init: vi.fn(),
        dispose: vi.fn(),
      },
    })

    kernel.start()
    kernel.stop()

    expect(unmountMock).toHaveBeenCalled()
  })

  it('calls dispose on LogicAdapter when finished', () => {
    const disposeMock = vi.fn()

    const kernel = createKernel({
      ui: {
        mount: vi.fn(),
        unmount: vi.fn(),
        update: vi.fn(),
      },
      logic: {
        init: vi.fn(),
        dispose: disposeMock,
      },
    })

    kernel.start()
    kernel.stop()

    expect(disposeMock).toHaveBeenCalled()
  })
})
