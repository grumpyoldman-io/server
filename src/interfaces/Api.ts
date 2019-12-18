import { injectable, inject } from 'inversify'

import { IApi, IConfig, ILights } from '../constants/interfaces'
import { TYPES, IRoutes } from '../constants/types'

@injectable()
class Api implements IApi {
  public routes: IRoutes = {
    get: {},
    post: {}
  }

  private _config: IConfig['api']
  private _switchConfig: IConfig['switches']
  private _lights: ILights

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Lights) lights: ILights
  ) {
    this._config = config.api
    this._switchConfig = config.switches
    this._lights = lights

    this.setRoutes()
  }

  private setRoutes = () => {
    Object.keys(this._switchConfig).forEach(switchId => {
      this.routes.get[
        this.createRouteWithParams(this._config.routes.switch, {
          id: switchId
        })
      ] = async respond => {
        try {
          await this._lights.toggle(this._switchConfig[switchId])
          respond({ message: `${switchId} toggled` }, 200)
        } catch (err) {
          respond(
            { error: `Error toggling ${switchId}`, details: err.message },
            500
          )
        }
      }
    })

    this.routes.get[this._config.routes.lights] = async respond => {
      try {
        const lightList = (await this._lights.list()).map(({ name, on }) => ({
          id: name,
          on
        }))

        respond(lightList, 200)
      } catch (err) {
        respond({ error: `Error getting status`, details: err.message }, 500)
      }
    }

    this.routes.get[this._config.routes.switches] = async respond => {
      try {
        const switchesList = Object.keys(this._switchConfig).reduce(
          (switches, id) => [
            ...switches,
            {
              id,
              name: this._switchConfig[id],
              path: this.createRouteWithParams(this._config.routes.switch, {
                id
              })
            }
          ],
          [] as Array<{ id: string; name: string; path: string }>
        )

        respond(switchesList, 200)
      } catch (err) {
        respond({ error: `Error getting status`, details: err.message }, 500)
      }
    }
  }

  private createRouteWithParams = (
    route: string,
    params: { [key: string]: string }
  ) =>
    Object.keys(params).reduce(
      (newRoute, key) =>
        newRoute.replace(new RegExp(`:${key}`, 'g'), params[key]),
      route
    )
}

export default Api
