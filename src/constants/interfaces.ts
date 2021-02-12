import { IncomingMessage } from 'http'
import kleur from 'kleur'

// Application
export interface IConfig {
  app: {
    environment: 'development' | 'test' | 'production'
    version: string
    commitHash: string
    timezone: string
    locale: string
  }
  log: {
    level: 'debug' | 'basic' | 'info' | 'all' | 'none'
  }
  server: {
    name: string
    port: number
  }
  api: {
    routes: Record<string, string>
  }
  lights: {
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
}

export interface ILogReturn {
  force: () => void
}

export interface ILogger {
  level: IConfig['log']['level']
  create: (
    entity: string,
    color?: Exclude<keyof kleur.Kleur, 'white' | 'grey' | 'yellow' | 'red'>
  ) => ILogger
  debug: (message?: any, ...optionalParams: any[]) => ILogReturn
  log: (message?: any, ...optionalParams: any[]) => ILogReturn
  info: (message?: any, ...optionalParams: any[]) => ILogReturn
  warn: (message?: any, ...optionalParams: any[]) => ILogReturn
  error: (message?: any, ...optionalParams: any[]) => ILogReturn
}

export interface IMetrics {
  start: (ID: string) => () => number
}

// Interfaces

export interface IRequest extends IncomingMessage {
  params: Record<string, string>
}
export interface IRoutes {
  [method: string]: {
    [path: string]: (
      request: IRequest,
      response: (data: object, statusCode: number | 200) => void
    ) => void
  }
}

export interface IApi {
  routes: IRoutes
}

// Entities
export interface IServer {
  name: IConfig['server']['name']
  addRoutes: (routes: IRoutes) => IServer
  listen: () => IServer
  close: () => IServer
}

export interface ILight {
  id: string
  name: string
  on: boolean
  toggle: () => Promise<void>
}

export interface ILights {
  list: () => ILight[]
  toggle: (name: ILight['name']) => Promise<void>
}
