export type IRouteHandler = (
  callback: (data: object, statusCode: number | 200) => void
) => void

export interface IRoute {
  [path: string]: IRouteHandler
}
export interface IRoutes {
  [method: string]: IRoute
}

export interface ILight {
  id: string
  name: string
  on: boolean
  toggle: () => Promise<void>
}

export const TYPES = {
  Config: Symbol.for('Config'),
  Logger: Symbol.for('Logger'),
  Server: Symbol.for('Server'),
  Api: Symbol.for('Api'),
  Lights: Symbol.for('Lights')
}
