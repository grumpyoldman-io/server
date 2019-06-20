import container from './container'

import { TYPES } from './constants/types'
import { IServerMessages, IConfig, ILights } from './constants/interfaces'

process.stdin.resume()

const config = container.get<IConfig>(TYPES.Config)
const lights = container.get<ILights>(TYPES.Lights)
const serverMessages = container.get<IServerMessages>(TYPES.ServerMessages)

// On server message
serverMessages.on(message => {
  // is button topic? then toggle
  if (config.buttons[message.topic]) {
    // tslint:disable-next-line:no-floating-promises
    lights.toggle(config.buttons[message.topic])
  }
})

serverMessages.listen()

const close = (error?: boolean) => {
  // Clean up processes before closing app.
  serverMessages.close()
  process.exit(error ? 1 : 0)
}

process.on('exit', () => close())
process.on('uncaughtException', () => close(true)) // catches uncaught exceptions
process.on('SIGINT', () => close()) // catches ctrl+c event
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', () => close())
process.on('SIGUSR2', () => close())
