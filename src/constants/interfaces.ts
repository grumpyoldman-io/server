import { ILight, IRoutes } from './types'
import kleur from 'kleur'

// Application
export interface IConfig {
  app: {
    environment: 'development' | 'test' | 'production'
    version: string
    commitHash: string
  }
  log: {
    level: 'all' | 'basic' | 'none'
  }
  server: {
    name: string
    port: number
  }
  admin: {
    routes: {
      status: string
      update: string
    }
  }
  api: {
    routes: {
      lights: string
      switch: string
      switches: string
    }
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
  switches: {
    [id: string]: string
  }
}

export interface ILogger {
  setPrefix: (
    prefix: string,
    color?: Exclude<keyof kleur.Kleur, 'white' | 'grey' | 'yellow' | 'red'>
  ) => ILogger
  log: (message?: any, ...optionalParams: any[]) => ILogger
  info: (message?: any, ...optionalParams: any[]) => ILogger
  warn: (message?: any, ...optionalParams: any[]) => ILogger
  error: (message?: any, ...optionalParams: any[]) => ILogger
  force: () => ILogger
}

// Interfaces
interface IWebInterface {
  routes: IRoutes
}
export type IAdmin = IWebInterface
export type IApi = IWebInterface

// Entities
export interface IGit {
  status(): Promise<string>
  update(): Promise<void>
}

export interface IServer {
  name: IConfig['server']['name']
  addRoutes(routes: IRoutes): IServer
  listen(): IServer
  close(): IServer
}

export interface ILights {
  list(): Promise<ILight[]>
  toggle(name: ILight['name']): Promise<void>
}
