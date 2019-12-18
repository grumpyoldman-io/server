import { injectable, inject } from 'inversify'

import { IAdmin, IConfig, IGit, IRoutes } from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Admin implements IAdmin {
  public routes: IRoutes = {
    get: {},
    post: {}
  }

  private _config: IConfig['admin']
  private _git: IGit

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Git) git: IGit
  ) {
    this._config = config.admin
    this._git = git

    this.setRoutes()
  }

  private setRoutes = () => {
    this.routes.get[this._config.routes.status] = async respond => {
      try {
        const status = await this._git.status()

        respond({ status }, 200)
      } catch (err) {
        respond({ error: `Error getting status`, details: err.message }, 500)
      }
    }

    this.routes.get[this._config.routes.update] = async respond => {
      try {
        await this._git.update()

        respond({ message: 'done' }, 200)
      } catch (err) {
        respond({ error: `Error updating`, details: err.message }, 500)
      }
    }
  }
}

export default Admin
