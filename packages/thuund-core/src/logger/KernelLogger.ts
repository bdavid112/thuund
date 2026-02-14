import { Logger } from '@thuund/core'

export class KernelLogger implements Logger {
  private loggers: Logger[] = []

  addLogger(logger: Logger) {
    this.loggers.push(logger)
  }
  removeLogger(logger: Logger) {
    this.loggers = this.loggers.filter((l) => l !== logger)
  }

  info(msg: string, ...meta: unknown[]) {
    this.loggers.forEach((l) => l.info(msg, ...meta))
  }

  warn(msg: string, ...meta: unknown[]) {
    this.loggers.forEach((l) => l.warn(msg, ...meta))
  }

  error(msg: string, ...meta: unknown[]) {
    this.loggers.forEach((l) => l.error(msg, ...meta))
  }
}
