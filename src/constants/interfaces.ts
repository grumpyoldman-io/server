import { IMessageSubscriber, ILight } from './types'

export interface IConfig {
  log: {
    level: 'all' | 'basic' | 'none'
  }
  mqtt: {
    host: string
    topics: string[]
  }
  hue: {
    host: string
    user: string
    initialState: {
      bri: number
      hue: number
      sat: number
      effect: string
      ct: number
    }
  }
  buttons: {
    [topic: string]: string
  }
}

export interface ILogger {
  create: (entity: string) => ILogger
  log: (message?: any, ...optionalParams: any[]) => void
  info: (message?: any, ...optionalParams: any[]) => void
  warn: (message?: any, ...optionalParams: any[]) => void
  error: (message?: any, ...optionalParams: any[]) => void
}

export interface IServerMessages {
  listen(): void
  on(subscriber: IMessageSubscriber): void
  close(): void
}

export interface ILights {
  list(): Promise<ILight[]>
  toggle(name: ILight['name']): Promise<void>
}
