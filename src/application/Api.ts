import { injectable, inject } from 'inversify'

import {
  IApi,
  IConfig,
  ILogger,
  ILights,
  IServer
} from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Api implements IApi {
  private _config: IConfig
  private _logger: ILogger
  private _lights: ILights

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Lights) lights: ILights,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this._config = config
    this._logger = logger.setPrefix('Api')
    this._lights = lights
  }

  public attach = (server: IServer) => {
    Object.keys(this._config.switches).forEach(switchId => {
      server.get(
        this.createRouteWithParams(this._config.api.routes.switch, {
          id: switchId
        }),
        async respond => {
          try {
            await this._lights.toggle(this._config.switches[switchId])
            respond({ message: `${switchId} toggled` }, 200)
          } catch (err) {
            respond(
              { error: `Error toggling ${switchId}`, details: err.message },
              500
            )
          }
        }
      )
    })

    server.get('/status', async respond => {
      try {
        const lightList = (await this._lights.list()).map(({ name, on }) => ({
          id: name,
          on
        }))
        const switchesList = Object.keys(this._config.switches).reduce(
          (switches, id) => [
            ...switches,
            {
              id,
              name: this._config.switches[id],
              path: this.createRouteWithParams(this._config.api.routes.switch, {
                id
              })
            }
          ],
          [] as Array<{ id: string; name: string; path: string }>
        )

        respond({ lights: lightList, switches: switchesList }, 200)
      } catch (err) {
        respond({ error: `Error getting status`, details: err.message }, 500)
      }
    })

    this._logger.info(`Attached to ${server.name}`)

    return server
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
