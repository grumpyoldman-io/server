import { injectable, inject } from 'inversify'
// import { match } from 'path-to-regexp'

import {
  IApi,
  IConfig,
  ILogger,
  ILights,
  IRoutes,
} from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Api implements IApi {
  public routes: IRoutes = {
    get: {},
  }

  private readonly config: IConfig['api']
  private readonly logger: ILogger
  private readonly lights: ILights

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.Lights) lights: ILights
  ) {
    this.config = config.api
    this.logger = logger.create('API', 'cyan')
    this.lights = lights

    this.setRoutes()
  }

  private readonly setRoutes = (): void => {
    this.routes.get[this.config.routes.light] = async (request, response) => {
      const hrStart = process.hrtime()
      try {
        if (request.params?.name === undefined) {
          throw new Error('Light name not given')
        }

        const light = this.lights
          .list()
          .map(({ name, on }) => ({
            id: name,
            on,
          }))
          .find(
            (light) =>
              light.id.toLowerCase() === request.params.name.toLowerCase()
          )

        if (light === undefined) {
          throw new Error('Light not found')
        }

        await this.lights.toggle(light.id)
        response({ message: `${light.id} toggled` }, 200)
      } catch (error) {
        response(
          {
            error: `Error toggling ${request.params?.name ?? 'light'}`,
            details: (error as Error).message,
          },
          500
        )
      }
      const hrEnd = process.hrtime(hrStart)
      this.logger.log(
        'handled',
        this.config.routes.light,
        `in ${hrEnd[1] / 1000000 + hrEnd[0] * 1000}ms`
      )
    }

    this.routes.get[this.config.routes.lights] = (_request, response) => {
      const hrStart = process.hrtime()
      try {
        const lightList = this.lights.list().map(({ name, on }) => ({
          id: name,
          on,
        }))

        response(lightList, 200)
      } catch (error) {
        response(
          { error: 'Error getting status', details: (error as Error).message },
          500
        )
      }
      const hrEnd = process.hrtime(hrStart)
      this.logger.log(
        'handled',
        this.config.routes.light,
        `in ${hrEnd[1] / 1000000 + hrEnd[0] * 1000}ms`
      )
    }
  }
}

export default Api
