import container from './application/container'

import { IServer, ILogger, IApi, IConfig } from './constants/interfaces'
import { TYPES } from './constants/types'

process.stdin.resume()

const config = container.get<IConfig>(TYPES.Config)
const logger = container
  .get<ILogger>(TYPES.Logger)
  .create('Application', 'green')
const server = container.get<IServer>(TYPES.Server)
const api = container.get<IApi>(TYPES.Api)

logger
  .log(
    `

    .    |    ,
     \\ _..._ /
 -_  .'     '. _-    Home Automation Server
    /         \\
 __ |         | __   vsn: ${config.app.version}
     \\  \\~/  /       cmh: ${config.app.commitHash}
    / \`\\ Y /\` \\      env: ${config.app.environment}
   '   |_|_|   '
       {___}
        "*"
`
  )
  .force()

server.addRoutes(api.routes).listen()

const close = (err?: Error): void => {
  if (err !== undefined) {
    logger.error(err.message)
  }

  // Clean up processes before closing app.
  server.close()
  process.exit(err !== undefined ? 1 : 0)
}

process.on('exit', () => close())
process.on('uncaughtException', (err) => close(err))
process.on('SIGINT', () => close())
process.on('SIGUSR1', () => close())
process.on('SIGUSR2', () => close())
