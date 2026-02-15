export interface UIAdapter {
  mount(container: unknown): unknown | Promise<unknown>
  unmount(): unknown | Promise<unknown>
  update(state: unknown): void
}
