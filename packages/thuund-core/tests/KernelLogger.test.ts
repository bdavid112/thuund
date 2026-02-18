import { describe, it, expect, vi } from 'vitest'
import { Kernel, KernelError } from '@thuund/core'

describe('Kernel Logging Diagnostics', () => {
  const mockLogger = () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  })

  const mockAdapters = {
    ui: { init: vi.fn(), mount: vi.fn(), unmount: vi.fn(), getComponent: vi.fn() },
    logic: { init: vi.fn(), dispose: vi.fn(), getService: vi.fn() },
  }

  it('logs the full lifecycle progression from start to stop', async () => {
    const logger = mockLogger()
    const kernel = new Kernel({ ...mockAdapters, logger })

    await kernel.start()
    await kernel.stop()

    // Verify system-level transparency
    const infoMessages = logger.info.mock.calls.map((call) => call[0])

    expect(infoMessages).toContain('[KERNEL] Starting...')
    expect(infoMessages).toContain('[KERNEL] Bootstrapped successfully')
    expect(infoMessages).toContain('[KERNEL] Stopping...')
    expect(infoMessages).toContain('[KERNEL] Stopped gracefully')
  })

  it('captures and logs the specific cause of a boot failure', async () => {
    const logger = mockLogger()
    const bootError = new Error('Database connection failed')

    const kernel = new Kernel({
      ...mockAdapters,
      logic: {
        ...mockAdapters.logic,
        init: async () => {
          throw bootError
        },
      },
      logger,
    })

    // Expect the generic KernelError for the developer, but check logger for the root cause
    await expect(kernel.start()).rejects.toThrow(KernelError)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[KERNEL] Boot failure'),
      bootError,
    )
  })

  it('logs plugin registration events for traceability', () => {
    const logger = mockLogger()
    const kernel = new Kernel({ ...mockAdapters, logger })

    kernel.registerPlugin({ name: 'AuthPlugin' })

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Registering plugin: AuthPlugin'),
    )
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('AuthPlugin registered successfully'),
    )
  })
})
