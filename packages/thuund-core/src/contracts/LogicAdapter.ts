export interface LogicAdapter {
  init(): unknown | Promise<unknown>
  dispose(): unknown | Promise<unknown>
}
