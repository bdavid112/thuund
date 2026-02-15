export interface LifecycleHooks {
  beforeStart?: () => unknown | Promise<unknown>
  afterStart?: () => unknown | Promise<unknown>
  beforeStop?: () => unknown | Promise<unknown>
  afterStop?: () => unknown | Promise<unknown>
  onError?: (error: unknown) => void | Promise<void>
}
