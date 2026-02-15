import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Kernel, KernelError } from '@thuund/core'

describe('Kernel plugin registration', () => {
  let kernel: Kernel

  beforeEach(() => {
    kernel = new Kernel({
      ui: {
        mount: async () => vi.fn(),
        unmount: async () => vi.fn(),
        update: () => {},
      },
      logic: {
        init: async () => vi.fn(),
        dispose: async () => vi.fn(),
      },
    })
  })

  it('registers plugin', async () => {
    kernel.registerPlugin({
      name: 'Plugin 1',
    })

    expect(kernel.Plugins().length).toBe(1)
  })

  it('deregisters plugin', async () => {
    const plugin = {
      name: 'Plugin 1',
    }

    kernel.registerPlugin(plugin)
    kernel.registerPlugin({ name: 'Plugin 2' })
    kernel.deregisterPlugin(plugin)

    expect(kernel.Plugins()).toStrictEqual([{ name: 'Plugin 2' }])
  })

  it('registers plugins in correct order', async () => {
    kernel.registerPlugin({
      name: 'Plugin 1',
    })

    kernel.registerPlugin({
      name: 'Plugin 2',
    })

    kernel.registerPlugin({
      name: 'Plugin 3',
    })

    expect(kernel.Plugins()).toStrictEqual([
      { name: 'Plugin 1' },
      { name: 'Plugin 2' },
      { name: 'Plugin 3' },
    ])
  })

  it('calls init function of each plugin on kernel start', async () => {
    const initMock1 = vi.fn()
    const initMock2 = vi.fn()

    kernel.registerPlugin({
      name: 'Plugin 1',
      init: initMock1,
    })

    kernel.registerPlugin({
      name: 'Plugin 2',
      init: initMock2,
    })

    await kernel.start()

    expect(initMock1).toBeCalled()
    expect(initMock2).toBeCalled()
  })

  it('calls dispose function of each plugin on kernel stop', async () => {
    const disposeMock1 = vi.fn()
    const disposeMock2 = vi.fn()

    kernel.registerPlugin({
      name: 'Plugin 1',
      dispose: disposeMock1,
    })

    kernel.registerPlugin({
      name: 'Plugin 2',
      dispose: disposeMock2,
    })

    await kernel.start()
    await kernel.stop()

    expect(disposeMock1).toBeCalled()
    expect(disposeMock2).toBeCalled()
  })

  it('throws error if plugin tried to be registered during run', async () => {
    await kernel.start()

    expect(() => {
      kernel.registerPlugin({ name: 'Plugin' })
    }).toThrow(KernelError)
  })

  it('throws error if plugin tried to be deregistered during run', async () => {
    const plugin = { name: 'Plugin' }
    kernel.registerPlugin(plugin)

    await kernel.start()

    expect(() => {
      kernel.deregisterPlugin(plugin)
    }).toThrow(KernelError)
  })
})
