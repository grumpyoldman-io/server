import { Container } from 'inversify'

import {
  IConfig,
  ILogger,
  IMetrics,
  IApi,
  IServer,
  ILights,
} from '../constants/interfaces'
import { TYPES } from '../constants/types'

import config from '../config'
import Logger from './Logger'
import Metrics from './Metrics'

import Api from '../interfaces/Api'

import Server from '../entities/Server'
import Lights from '../entities/Lights'

const container = new Container()
container.bind<IConfig>(TYPES.Config).toConstantValue(config)
container.bind<ILogger>(TYPES.Logger).to(Logger)
container.bind<IMetrics>(TYPES.Metrics).to(Metrics)
container.bind<IApi>(TYPES.Api).to(Api)

container.bind<IServer>(TYPES.Server).to(Server)
container.bind<ILights>(TYPES.Lights).to(Lights)

export default container
