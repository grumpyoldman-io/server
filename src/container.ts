import { Container } from 'inversify'

import { TYPES } from './constants/types'
import {
  IConfig,
  ILogger,
  IApi,
  IServer,
  ILights
} from './constants/interfaces'

import config from './application/config'
import Logger from './application/Logger'
import Api from './application/Api'

import Server from './entities/Server'
import Lights from './entities/Lights'

const container = new Container()
container.bind<IConfig>(TYPES.Config).toConstantValue(config)
container.bind<ILogger>(TYPES.Logger).to(Logger)
container.bind<IApi>(TYPES.Api).to(Api)

container.bind<IServer>(TYPES.Server).to(Server)
container.bind<ILights>(TYPES.Lights).to(Lights)

export default container
