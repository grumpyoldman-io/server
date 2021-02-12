import { injectable, inject } from 'inversify'
import kleur, { Kleur } from 'kleur'

import { IConfig, ILogger, ILogReturn } from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Logger implements ILogger {
  private readonly config: IConfig['log']
  private readonly appConfig: IConfig['app']

  private prefix: string = ''
  public readonly level: ILogger['level']

  public constructor(@inject(TYPES.Config) config: IConfig) {
    this.config = config.log
    this.appConfig = config.app

    this.level = this.config.level
  }

  public readonly create: ILogger['create'] = (entity, color = 'cyan') => {
    this.prefix = kleur[color](`[${entity}]`)
    return this
  }

  public readonly debug: ILogger['debug'] = (message, ...optionalParams) =>
    this.outputMessage(
      'debug',
      'blue',
      ['debug', 'all'],
      message,
      optionalParams
    )

  public readonly log: ILogger['log'] = (message, ...optionalParams) =>
    this.outputMessage(
      'log',
      'gray',
      ['debug', 'all', 'basic'],
      message,
      optionalParams
    )

  public readonly info: ILogger['info'] = (message, ...optionalParams) =>
    this.outputMessage(
      'info',
      'white',
      ['debug', 'all', 'basic', 'info'],
      message,
      optionalParams
    )

  public readonly warn: ILogger['warn'] = (message, ...optionalParams) =>
    this.outputMessage(
      'warn',
      'yellow',
      ['debug', 'all', 'basic', 'info'],
      message,
      optionalParams
    )

  public readonly error: ILogger['error'] = (message, ...optionalParams) =>
    this.outputMessage(
      'error',
      'red',
      ['debug', 'all', 'basic', 'info'],
      message,
      optionalParams
    )

  private readonly outputMessage = (
    level: 'debug' | 'log' | 'info' | 'warn' | 'error',
    color: keyof Kleur,
    levels: Array<IConfig['log']['level']>,
    message: any,
    optionalParams: any[]
  ): ILogReturn => {
    let output = (): void =>
      // eslint-disable-next-line no-console
      console[level](
        this.timeStamp(),
        this.prefix,
        kleur[color](message),
        ...optionalParams
      )

    if (levels.includes(this.config.level)) {
      output()
      output = () => null
    }

    return this.returnForce(output)
  }

  private readonly returnForce = (output: () => void): ILogReturn => ({
    force: output,
  })

  private readonly timeStamp = (): string => {
    const date = new Date()
    return kleur.grey(
      `[${date.toLocaleString(this.appConfig.locale, {
        timeZone: this.appConfig.timezone,
      })}]`
    )
  }
}

export default Logger
