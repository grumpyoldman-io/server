import { injectable, inject } from 'inversify'
import kleur from 'kleur'

import { IConfig, ILogger } from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Logger implements ILogger {
  private _config: IConfig['log']
  private _prefix: string = ''

  public constructor(@inject(TYPES.Config) config: IConfig) {
    this._config = config.log
  }

  public create: ILogger['create'] = (entity, color = 'cyan') => {
    this._prefix = kleur[color](`[${entity}]`)
    return this
  }

  public log: ILogger['log'] = (message, ...optionalParams) => {
    let output = () =>
      console.info(
        this.timeStamp(),
        this._prefix,
        kleur.grey(message),
        ...optionalParams
      )
    if (this._config.level !== 'none') {
      output()
      output = () => null
    }

    return this.returnForce(output)
  }

  public info: ILogger['info'] = (message, ...optionalParams) => {
    let output = () =>
      console.info(
        this.timeStamp(),
        this._prefix,
        kleur.white(message),
        ...optionalParams
      )

    if (this._config.level === 'all') {
      output()
      output = () => null
    }

    return this.returnForce(output)
  }

  public warn: ILogger['warn'] = (message, ...optionalParams) => {
    let output = () =>
      console.warn(
        this.timeStamp(),
        this._prefix,
        kleur.yellow(message),
        ...optionalParams
      )

    if (this._config.level !== 'none') {
      output()
      output = () => null
    }

    return this.returnForce(output)
  }

  public error: ILogger['error'] = (message, ...optionalParams) => {
    let output = () =>
      console.error(
        this.timeStamp(),
        this._prefix,
        kleur.red(message),
        ...optionalParams
      )

    if (this._config.level !== 'none') {
      output()
      output = () => null
    }

    return this.returnForce(output)
  }

  private returnForce = (output: () => void) => ({ force: output })

  private timeStamp = (): string => {
    const date = new Date()
    return kleur.grey(`[${date.toISOString()}]`)
  }
}

export default Logger
