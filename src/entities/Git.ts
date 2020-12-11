import { injectable, inject } from 'inversify'

import { exec } from 'child_process'

import { IConfig, IGit, ILogger } from '../constants/interfaces'
import { TYPES } from '../constants/types'

type Log = string[]

@injectable()
class Git implements IGit {
  private readonly _config: IConfig['app']
  private readonly _logger: ILogger

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
        this._logger.error(`\n${(error as Error).message}`)
      }
    }

    let log: Log = []

    try {
      log = await this.log()
    } catch (error) {
      if (this._config.environment === 'development') {
        this._logger.error('Unable to get log')
        this._logger.error(`\n${(error as Error).message}`)
      }
    }

    if (log.length > 0) {
      if (this._config.commitHash === log[0]) {
        return 'Up to date'
      } else {
        const distance = log.indexOf(this._config.commitHash)
        return `Outdated${
          distance !== -1 && ` by ${distance} commits`
        }, please update`
      }
    }

    return 'N.A.'
  }

  public update: IGit['update'] = async () => {
    try {
      await this.pull()
    } catch (error) {
      const message = 'Unable to pull in new changes'
      if (this._config.environment === 'development') {
        this._logger.error(message)
        this._logger.error(`\n${(error as Error).message}`)
      }
      throw new Error(message)
    }

    let commitHash = this._config.commitHash
    try {
      commitHash = await this.revParse()
    } catch (error) {
      const message = 'Unable to get new commit hash'
      if (this._config.environment === 'development') {
        this._logger.error(message)
        this._logger.error(`\n${(error as Error).message}`)
      }
    }

    if (commitHash !== this._config.commitHash) {
      this._logger.info('New version available, starting build')

      try {
        const buildLog = await this.build()
        if (this._config.environment === 'development') {
          this._logger.log(`\n${buildLog}\n`)
        }
      } catch (error) {
        const message = 'Unable to build new version'
        if (this._config.environment === 'development') {
          this._logger.error(message)
          this._logger.error(`\n${(error as Error).message}\n`)
        }
        throw new Error(message)
      }
    }
  }

  private readonly fetch = async (): Promise<void> =>
    await new Promise((resolve, reject) => {
      exec('git fetch', (error) => {
        if (error !== null) {
          return reject(error)
        }
        return resolve()
      })
    })

  private readonly log = async (): Promise<Log> =>
    await new Promise((resolve, reject) => {
      exec('git log --pretty="@begin@%H@end@"', (error, stdout) => {
        if (error !== null) {
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
            .map((entry) => entry.slice(7, -5))
        )
      })
    })

  private readonly pull = async (): Promise<string> =>
    await new Promise((resolve, reject) => {
      exec('git pull --rebase', (error, stdout) => {
        if (error !== null) {
          return reject(error)
        }
        return resolve(stdout.toString().trim())
      })
    })

  private readonly revParse = async (): Promise<string> =>
    await new Promise((resolve, reject) => {
      exec('git rev-parse HEAD', (error, stdout) => {
        if (error !== null) {
          return reject(error)
        }
        return resolve(stdout.toString().trim())
      })
    })

  private readonly build = async (): Promise<string> =>
    await new Promise<string>((resolve, reject) => {
      exec('npm run build', (error, stdout) => {
        if (error !== null) {
          return reject(error)
        }
        return resolve(stdout.toString().trim())
      })
    })
}

export default Git
