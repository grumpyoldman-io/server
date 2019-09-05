import { injectable, inject } from 'inversify'
import { HueApi, nupnpSearch, lightState } from 'node-hue-api'

import { IConfig, ILights, ILogger } from '../constants/interfaces'
import { TYPES, ILight } from '../constants/types'

@injectable()
class Lights implements ILights {
  private _config: IConfig['hue']
  private _logger: ILogger
  private api: HueApi
  private lights: ILight[] = []
  private lightState: lightState.State

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this._config = config.hue
    this._logger = logger.create('Lights')

    this.api = new HueApi(this._config.host, this._config.user)

    this.lightState = lightState.create(this._config.initialState)

    // tslint:disable-next-line:no-floating-promises
    this.connect()
  }

  public list: ILights['list'] = async () => {
    await this.update()
    this._logger.log(
      'lights',
      this.lights.map(({ on, name }) => ({ on, name }))
    )
    return this.lights
  }

  public toggle: ILights['toggle'] = async name => {
    await this.update()
    const light = this.lights.find(l => l.name === name)
    if (light) {
      if (light.on) {
        await this.api.setLightState(light.id, this.lightState.off())
      } else {
        await this.api.setLightState(light.id, this.lightState.on())
      }
      this._logger.log('toggled light', name)
    } else {
      this._logger.error('Error toggling light', name)
    }
  }

  private connect = async () => {
    try {
      await this.api.config()
      await this.reset()
    } catch (err) {
      this._logger.error('Error connecting to Hue Bridge')
      this._logger.log(
        'please set up a user and add the data to the .env.local'
      )
      this._logger.log(
        `check out: https://developers.meethue.com/documentation/getting-started`
      )

      await this.discover()
    }
  }

  private discover = async () => {
    try {
      const bridges = await nupnpSearch()
      this._logger.log('Hue Bridges Found:')
      this._logger.log(JSON.stringify(bridges))
    } catch (err) {
      this._logger.error(`Error discovering bridges`, err)
    }
  }

  private update = async () => {
    try {
      const state = await this.api.getFullState()

      this.lights = Object.keys(state.lights).map(id => ({
        id,
        name: state.lights[id].name,
        on: state.lights[id].state.on,
        toggle: () => this.toggle(state.lights[id].name)
      }))
    } catch (err) {
      this._logger.error(`Error updating state`, err)
    }
  }

  private reset = async () => {
    await this.update()
    await Promise.all(
      this.lights.map(async light => {
        if (light.on) {
          await light.toggle()
        }
      })
    )
  }
}

export default Lights
