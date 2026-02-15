import { describe, it, expect } from 'vitest'
import { Kernel } from '@thuund/core'

describe('Kernel lifecycle hooks', () => {
  it('calls hooks in correct order', async () => {
    const order: string[] = []

    const kernel = new Kernel({
      ui: {
        mount: async () => order.push('ui.mount'),
        unmount: async () => order.push('ui.unmount'),
        update: () => {},
      },
      logic: {
        init: async () => order.push('logic.init'),
        dispose: async () => order.push('logic.dispose'),
      },
      hooks: {
        beforeStart: async () => order.push('beforeStart'),
        afterStart: async () => order.push('afterStart'),
        beforeStop: async () => order.push('beforeStop'),
        afterStop: async () => order.push('afterStop'),
      },
    })

    await kernel.start()
    await kernel.stop()

    expect(order).toEqual([
      'beforeStart',
      'logic.init',
      'ui.mount',
      'afterStart',
      'beforeStop',
      'ui.unmount',
      'logic.dispose',
      'afterStop',
    ])
  })
})
