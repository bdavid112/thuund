export interface UIAdapter {
  mount(container: unknown): void
  unmount(): void
  update(state: unknown): void
}
