import container from './container'

import { TYPES } from './constants/types'
import { IApi, ILights, IConfig } from './constants/interfaces'

process.stdin.resume()

const config = container.get<IConfig>(TYPES.Config)
const lights = container.get<ILights>(TYPES.Lights)
const api = container.get<IApi>(TYPES.Api)

// On server request
api.on(request => {
  Object.keys(config.switches).forEach(async switchId => {
    if (request.url === `/switch/${switchId}/toggle`) {
      await lights.toggle(config.switches[switchId])
    }
  })
})

api.listen()

const close = (error?: boolean) => {
  // Clean up processes before closing app.
  api.close()
  process.exit(error ? 1 : 0)
}

process.on('exit', () => close())
process.on('uncaughtException', () => close(true)) // catches uncaught exceptions
process.on('SIGINT', () => close()) // catches ctrl+c event
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', () => close())
process.on('SIGUSR2', () => close())
