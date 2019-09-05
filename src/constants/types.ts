export interface IRequest {
  url: string
}
export type IRequestSubscriber = (request: IRequest) => void

export interface ILight {
  id: string
  name: string
  on: boolean
  toggle: () => Promise<void>
}

export const TYPES = {
  Config: Symbol.for('Config'),
  Logger: Symbol.for('Logger'),
  Api: Symbol.for('Api'),
  Lights: Symbol.for('Lights'),
  Buttons: Symbol.for('Buttons')
}
