import { Kleur } from 'kleur'

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
    color?: Exclude<keyof Kleur, 'white' | 'grey' | 'yellow' | 'red'>
  ) => ILogger
  log: (message?: any, ...optionalParams: any[]) => ILogger
  info: (message?: any, ...optionalParams: any[]) => ILogger
  warn: (message?: any, ...optionalParams: any[]) => ILogger
  error: (message?: any, ...optionalParams: any[]) => ILogger
  force: () => ILogger
}

// Interfaces
export interface IRoutes {
  [method: string]: {
    [path: string]: (
      callback: (data: object, statusCode: number | 200) => void
    ) => void
  }
}

export interface IAdmin {
  routes: IRoutes
}

export interface IApi {
  routes: IRoutes
}

// Entities
export interface IGit {
  status: () => Promise<string>
  update: () => Promise<void>
}

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
  list: () => Promise<ILight[]>
  toggle: (name: ILight['name']) => Promise<void>
}
