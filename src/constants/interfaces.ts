import { ILight, IRoutes } from './types'
import kleur from 'kleur'

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

export interface IServer {
  name: IConfig['server']['name']
  addRoutes(routes: IRoutes): IServer
  listen(): IServer
  close(): IServer
}

interface IWebInterface {
  routes: IRoutes
}
export type IApi = IWebInterface

export interface ILights {
  list(): Promise<ILight[]>
  toggle(name: ILight['name']): Promise<void>
}
