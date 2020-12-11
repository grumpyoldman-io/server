import { injectable, inject } from 'inversify'

import { IApi, IConfig, ILights, IRoutes } from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Api implements IApi {
  public routes: IRoutes = {
    get: {},
  }

  private readonly _config: IConfig['api']
  private readonly _switchConfig: IConfig['switches']
  private readonly _lights: ILights

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Lights) lights: ILights
  ) {
    this._config = config.api
    this._switchConfig = config.switches
    this._lights = lights

    this.setRoutes()
  }

  private readonly setRoutes = (): void => {
    Object.keys(this._switchConfig).forEach((switchId) => {
      this.routes.get[
        this.createRouteWithParams(this._config.routes.switch, {
          id: switchId,
        })
      ] = async (respond) => {
        try {
          await this._lights.toggle(this._switchConfig[switchId])
          respond({ message: `${switchId} toggled` }, 200)
        } catch (error) {
          respond(
            {
              error: `Error toggling ${switchId}`,
              details: (error as Error).message,
            },
            500
          )
        }
      }
    })

    this.routes.get[this._config.routes.lights] = async (respond) => {
      try {
        const lightList = (await this._lights.list()).map(({ name, on }) => ({
          id: name,
          on,
        }))

        respond(lightList, 200)
      } catch (error) {
        respond(
          { error: 'Error getting status', details: (error as Error).message },
          500
        )
      }
    }

    this.routes.get[this._config.routes.switches] = (respond) => {
      try {
        const switchesList = Object.keys(this._switchConfig).reduce<
          Array<{ id: string; name: string; path: string }>
        >(
          (switches, id) => [
            ...switches,
            {
              id,
              name: this._switchConfig[id],
              path: this.createRouteWithParams(this._config.routes.switch, {
                id,
              }),
            },
          ],
          []
        )

        respond(switchesList, 200)
      } catch (error) {
        respond(
          { error: 'Error getting status', details: (error as Error).message },
          500
        )
      }
    }
  }

  private readonly createRouteWithParams = (
    route: string,
    params: { [key: string]: string }
  ): string =>
    Object.keys(params).reduce(
      (newRoute, key) =>
        newRoute.replace(new RegExp(`:${key}`, 'g'), params[key]),
      route
    )
}

export default Api
