import { injectable, inject } from 'inversify'

import { exec } from 'child_process'

import { IConfig, IGit, ILogger } from '../constants/interfaces'
import { TYPES } from '../constants/types'

type Log = string[]

@injectable()
class Git implements IGit {
  private _config: IConfig['app']
  private _logger: ILogger

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this._config = config.app
    this._logger = logger.setPrefix('Git', 'black')
  }

  public status: IGit['status'] = async () => {
    try {
      await this.fetch()
    } catch (error) {
      if (this._config.environment === 'development') {
        this._logger.error('Unable to fetch')
        this._logger.error(`\n${error.message}`)
      }
    }

    let log: Log = []

    try {
      log = await this.log()
    } catch (error) {
      if (this._config.environment === 'development') {
        this._logger.error('Unable to get log')
        this._logger.error(`\n${error.message}`)
      }
    }

    if (log.length) {
      if (this._config.commitHash === log[0]) {
        return 'Up to date'
      } else {
        const distance = log.indexOf(this._config.commitHash)
        return `Outdated${distance !== -1 &&
          ` by ${distance} commits`}, please update`
      }
    }

    return 'N.A.'
  }

  private fetch = async () =>
    new Promise<void>((resolve, reject) => {
      exec('git fetch', error => {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })

  private log = async () =>
    new Promise<Log>((resolve, reject) => {
      exec('git log --pretty="@begin@%H@end@"', (error, stdout) => {
        if (error) {
          return reject(error)
        }
        if (!stdout.includes('@begin@')) {
          return reject(new Error('No valid log found'))
        }

        return resolve(
          stdout
            .toString()
            .trim()
            .split('\n')
            .map(entry => entry.slice(7, -5))
        )
      })
    })
}

export default Git
