import { IRouteHandler, ILight } from './types'
import kleur from 'kleur'

export interface IConfig {
  log: {
    level: 'all' | 'basic' | 'none'
  }
  server: {
    name: string
    port: number
  }
  api: {
    routes: {
      home: string
      status: string
      switch: string
      [key: string]: string
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

interface IForce {
  force: () => void
}
export interface ILogger {
  create: (
    entity: string,
    color?: Exclude<keyof kleur.Kleur, 'white' | 'grey' | 'yellow' | 'red'>
  ) => ILogger
  log: (message?: any, ...optionalParams: any[]) => IForce
  info: (message?: any, ...optionalParams: any[]) => IForce
  warn: (message?: any, ...optionalParams: any[]) => IForce
  error: (message?: any, ...optionalParams: any[]) => IForce
}

export interface IServer {
  name: IConfig['server']['name']
  listen(): void
  close(): void
  get(path: string, handler: IRouteHandler): void
  post(path: string, handler: IRouteHandler): void
}

export interface IApi {
  attach(server: IServer): IServer
}

export interface ILights {
  list(): Promise<ILight[]>
  toggle(name: ILight['name']): Promise<void>
}
