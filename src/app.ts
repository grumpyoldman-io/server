import container from './container'

import { TYPES } from './constants/types'
import { IServer, ILogger, IApi } from './constants/interfaces'

process.stdin.resume()

const logger = container
  .get<ILogger>(TYPES.Logger)
  .create('Application', 'green')
const server = container.get<IServer>(TYPES.Server)
const router = container.get<IApi>(TYPES.Api)

logger.info(`Starting app in ${process.env.NODE_ENV} mode`)

router.attach(server).listen()

const close = (err?: Error) => {
  if (err) {
    logger.error(err.message)
  }

  // Clean up processes before closing app.
  server.close()
  process.exit(err ? 1 : 0)
}

process.on('exit', () => close())
process.on('uncaughtException', err => close(err))
process.on('SIGINT', () => close())
process.on('SIGUSR1', () => close())
process.on('SIGUSR2', () => close())
