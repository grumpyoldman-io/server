import { injectable, inject } from 'inversify'

import { IAdmin, IConfig, IGit } from '../constants/interfaces'
import { TYPES, IRoutes } from '../constants/types'

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
  }
}

export default Admin
