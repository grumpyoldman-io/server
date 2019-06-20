import { injectable, inject } from 'inversify'

import { IConfig, ILogger } from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Logger implements ILogger {
  private _config: IConfig['log']
  private _prefix: string = ''

  public constructor(@inject(TYPES.Config) config: IConfig) {
    this._config = config.log
  }

  public create: ILogger['create'] = entity => {
    this._prefix = `[${entity}]: `
    return this
  }

  public log: ILogger['log'] = (message, ...optionalParams) => {
    if (this._config.level !== 'none') {
      console.info(this._prefix, message, ...optionalParams)
    }
  }

  public info: ILogger['info'] = (message, ...optionalParams) => {
    if (this._config.level === 'all') {
      console.info(this._prefix, message, ...optionalParams)
    }
  }

  public warn: ILogger['warn'] = (message, ...optionalParams) => {
    if (this._config.level !== 'none') {
      console.warn(this._prefix, message, ...optionalParams)
    }
  }

  public error: ILogger['error'] = (message, ...optionalParams) => {
    if (this._config.level !== 'none') {
      console.error(this._prefix, message, ...optionalParams)
    }
  }
}

export default Logger
