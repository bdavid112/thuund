export interface UIAdapter {
  init(config: unknown): Promise<void>
  mount(container: any): Promise<void>
  unmount(): Promise<void>
}
