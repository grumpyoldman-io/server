import { IConfig } from '../constants/interfaces'

const API_PORT = parseInt(process.env.API_PORT || '3000', 10)

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
  log: {
    level: LOG_LEVEL
  },
  api: {
    port: API_PORT
  },
  hue: {
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
