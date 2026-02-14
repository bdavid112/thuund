export class KernelError extends Error {
  public inner?: unknown

  constructor(message: string, inner?: unknown) {
    super(message)
    this.name = 'KernelError'
    this.inner = inner
  }
}
