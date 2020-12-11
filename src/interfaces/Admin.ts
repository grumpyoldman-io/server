import { injectable, inject } from 'inversify'

import { IAdmin, IConfig, IGit, IRoutes } from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Admin implements IAdmin {
  public routes: IRoutes = {
    get: {},
    post: {},
  }

  private readonly _config: IConfig['admin']
  private readonly _git: IGit

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Git) git: IGit
  ) {
    this._config = config.admin
    this._git = git

    this.setRoutes()
  }

  private readonly setRoutes = (): void => {
    this.routes.get[this._config.routes.status] = async (respond) => {
      try {
        const status = await this._git.status()

        respond({ status }, 200)
      } catch (error) {
        respond(
          { error: 'Error getting status', details: (error as Error).message },
          500
        )
      }
    }

    this.routes.get[this._config.routes.update] = async (respond) => {
      try {
        await this._git.update()

        respond({ message: 'done' }, 200)
      } catch (error) {
        respond(
          { error: 'Error updating', details: (error as Error).message },
          500
        )
      }
    }
  }
}

export default Admin
