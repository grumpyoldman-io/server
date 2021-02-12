import fs from 'fs'
import { IConfig } from './constants/interfaces'

let COMMIT_HASH: string
if (process.env.COMMIT_HASH === undefined) {
  try {
    COMMIT_HASH = fs.readFileSync('.git/HEAD').toString().trim()
    if (COMMIT_HASH.includes(':')) {
      COMMIT_HASH = fs
        .readFileSync('.git/' + COMMIT_HASH.substring(5))
        .toString()
        .trim()
    }
  } catch {
    COMMIT_HASH = 'n.a.'
  }
} else {
  COMMIT_HASH = 'n.a.'
}

const ENV =
  (process.env.NODE_ENV as IConfig['app']['environment']) ?? 'production'
const VERSION = process.env.VERSION ?? process.env.npm_package_version ?? 'n.a.'
const TIMEZONE = process.env.TIMEZONE ?? process.env.TZ ?? 'GMT'
const LOCALE =
  process.env.LOCALE ??
  Intl.DateTimeFormat().resolvedOptions().locale ??
  'en-GB'

const SERVER_PORT = parseInt(process.env.SERVER_PORT ?? '3000', 10)

const LOG_LEVEL = (process.env.LOG_LEVEL ?? 'basic') as IConfig['log']['level']

const HUE_HOST = process.env.HUE_HOST ?? ''
const HUE_USER = process.env.HUE_USER ?? ''

const config: IConfig = {
  app: {
    environment: ENV,
    version: VERSION,
    commitHash: COMMIT_HASH,
    timezone: TIMEZONE,
    locale: LOCALE,
  },
  log: {
    level: LOG_LEVEL,
  },
  server: {
    name: 'HomeAutomation',
    port: SERVER_PORT,
  },
  api: {
    routes: {
      lights: '/lights',
      light: '/lights/:name/toggle',
    },
  },
  lights: {
    host: HUE_HOST,
    user: HUE_USER,
    initialState: {
      bri: 254,
      hue: 14948,
      sat: 143,
      effect: 'none',
      ct: 365,
    },
  },
}

export default config
