import { Logger } from '@thuund/core'

export const consoleLogger: Logger = {
  info: (message, ...meta) => console.log('[INFO]', message, ...meta),
  warn: (message, ...meta) => console.warn('[WARN]', message, ...meta),
  error: (message, ...meta) => console.error('[ERROR]', message, ...meta),
}
