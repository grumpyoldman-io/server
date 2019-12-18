import { injectable, inject } from 'inversify'
import kleur from 'kleur'

import { IConfig, ILogger } from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Logger implements ILogger {
  private _config: IConfig['log']

  private prefix: string
  private output: () => void

  public constructor(@inject(TYPES.Config) config: IConfig) {
    this._config = config.log
    this.prefix = ''
    this.output = () => null
  }

  public setPrefix: ILogger['setPrefix'] = (prefix, color) => {
    this.prefix = kleur[color ? color : 'white'](`[${prefix}]`)
    return this
  }

  public log: ILogger['log'] = (message, ...optionalParams) => {
    this.output = () =>
      console.info(
        this.timeStamp(),
        this.prefix,
        kleur.grey(this.formatMessage(message)),
        ...optionalParams
      )
    if (this._config.level !== 'none') {
      this.output()
      this.resetOutput()
    }

    return this
  }

  public info: ILogger['info'] = (message, ...optionalParams) => {
    this.output = () =>
      console.info(
        this.timeStamp(),
        this.prefix,
        kleur.white(this.formatMessage(message)),
        ...optionalParams
      )

    if (this._config.level === 'all') {
      this.output()
      this.resetOutput()
    }

    return this
  }

  public warn: ILogger['warn'] = (message, ...optionalParams) => {
    this.output = () =>
      console.warn(
        this.timeStamp(),
        this.prefix,
        kleur.yellow(this.formatMessage(message)),
        ...optionalParams
      )

    if (this._config.level !== 'none') {
      this.output()
      this.resetOutput()
    }

    return this
  }

  public error: ILogger['error'] = (message, ...optionalParams) => {
    this.output = () =>
      console.error(
        this.timeStamp(),
        this.prefix,
        kleur.red(this.formatMessage(message)),
        ...optionalParams
      )

    if (this._config.level !== 'none') {
      this.output()
      this.resetOutput()
    }

    return this
  }

  public force: ILogger['force'] = () => {
    this.output()
    this.resetOutput()

    return this
  }

  private timeStamp = (): string => {
    const date = new Date()
    return kleur.grey(`[${date.toISOString()}]`)
  }

  private formatMessage = (message: any) => {
    if (typeof message === 'object') {
      return JSON.stringify(message, null, 2)
    }
    return message
  }

  private resetOutput = () => {
    this.output = () => null
  }
}

export default Logger
