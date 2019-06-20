export interface IMessage {
  topic: string
  payload?: unknown
}
export type IMessageSubscriber = (message: IMessage) => void

export interface ILight {
  id: string
  name: string
  on: boolean
  toggle: () => Promise<void>
}

export const TYPES = {
  Config: Symbol.for('Config'),
  Logger: Symbol.for('Logger'),
  ServerMessages: Symbol.for('ServerMessages'),
  Lights: Symbol.for('Lights'),
  Buttons: Symbol.for('Buttons')
}
