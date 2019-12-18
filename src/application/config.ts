import { IConfig } from '../constants/interfaces'

const ENV =
  (process.env.NODE_ENV as IConfig['app']['environment']) || 'production'
const VERSION = process.env.VERSION || 'n.a.'
const COMMIT_HASH = process.env.COMMIT_HASH || 'n.a.'

const SERVER_PORT = parseInt(process.env.SERVER_PORT || '3000', 10)

const LOG_LEVEL = (process.env.LOG_LEVEL || 'basic') as IConfig['log']['level']

const HUE_HOST = process.env.HUE_HOST || ''
const HUE_USER = process.env.HUE_USER || ''

const BUTTON_PREFIX = 'SWITCH_'

const switches = Object.keys(process.env).reduce(
  (switchIds, envKey) =>
    envKey.startsWith(BUTTON_PREFIX)
      ? {
          ...switchIds,
          [envKey.replace(BUTTON_PREFIX, '')]: process.env[envKey]
        }
      : switchIds,
  {}
)

const config: IConfig = {
  app: {
    environment: ENV,
    version: VERSION,
    commitHash: COMMIT_HASH
  },
  log: {
    level: LOG_LEVEL
  },
  server: {
    name: 'HomeAutomation',
    port: SERVER_PORT
  },
  admin: {
    routes: {
      status: '/status'
    }
  },
  api: {
    routes: {
      lights: '/lights',
      switches: '/switches',
      switch: '/switches/:id/toggle'
    }
  },
  lights: {
    host: HUE_HOST,
    user: HUE_USER,
    initialState: {
      bri: 254,
      hue: 14948,
      sat: 143,
      effect: 'none',
      ct: 365
    }
  },
  switches
}

export default config
