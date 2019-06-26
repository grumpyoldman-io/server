import { IConfig } from '../constants/interfaces'

const MQTT_HOST = process.env.MQTT_HOST || ''

const HUE_HOST = process.env.HUE_HOST || ''
const HUE_USER = process.env.HUE_USER || ''

const BUTTON_PREFIX = '_SWITCH'

const buttons = Object.keys(process.env).reduce((topics, topic) => {
  if (topic.startsWith(BUTTON_PREFIX)) {
    topics = {
      ...topics,
      [BUTTON_PREFIX.length]: process.env[topic]
    }
  }
  return topics
}, {})

const config: IConfig = {
  log: {
    level: 'all'
  },
  mqtt: {
    host: MQTT_HOST,
    topics: Object.keys(buttons)
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
  buttons
}

export default config
