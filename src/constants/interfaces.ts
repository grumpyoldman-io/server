import { IRequestSubscriber, ILight } from './types'

export interface IConfig {
  log: {
    level: 'all' | 'basic' | 'none'
  }
  api: {
    port: number
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
  switches: {
    [id: string]: string
  }
}

export interface ILogger {
  create: (entity: string) => ILogger
  log: (message?: any, ...optionalParams: any[]) => void
  info: (message?: any, ...optionalParams: any[]) => void
  warn: (message?: any, ...optionalParams: any[]) => void
  error: (message?: any, ...optionalParams: any[]) => void
}

export interface IApi {
  listen(): void
  close(): void
  on(subscriber: IRequestSubscriber): void
}

export interface ILights {
  list(): Promise<ILight[]>
  toggle(name: ILight['name']): Promise<void>
}
