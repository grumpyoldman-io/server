import { Container } from 'inversify'

import { TYPES } from './constants/types'
import {
  IConfig,
  ILogger,
  IAdmin,
  IApi,
  IGit,
  IServer,
  ILights
} from './constants/interfaces'

import config from './application/config'
import Logger from './application/Logger'
import Admin from './application/Admin'
import Api from './application/Api'

import Git from './entities/Git'
import Server from './entities/Server'
import Lights from './entities/Lights'

const container = new Container()
container.bind<IConfig>(TYPES.Config).toConstantValue(config)
container.bind<ILogger>(TYPES.Logger).to(Logger)
container.bind<IAdmin>(TYPES.Admin).to(Admin)
container.bind<IApi>(TYPES.Api).to(Api)

container.bind<IGit>(TYPES.Git).to(Git)
container.bind<IServer>(TYPES.Server).to(Server)
container.bind<ILights>(TYPES.Lights).to(Lights)

export default container
