import { Container } from 'inversify'

import { TYPES } from './constants/types'
import {
  IConfig,
  ILogger,
  IServerMessages,
  ILights
} from './constants/interfaces'

import config from './application/config'
import Logger from './application/Logger'

import ServerMessages from './entities/ServerMessages'
import Lights from './entities/Lights'

const container = new Container()
container.bind<IConfig>(TYPES.Config).toConstantValue(config)
container.bind<ILogger>(TYPES.Logger).to(Logger)
container.bind<IServerMessages>(TYPES.ServerMessages).to(ServerMessages)
container.bind<ILights>(TYPES.Lights).to(Lights)

export default container
