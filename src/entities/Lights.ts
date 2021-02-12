import { injectable, inject } from 'inversify'
import { HueApi, nupnpSearch, lightState } from 'node-hue-api'

import { IConfig, ILights, ILogger, ILight } from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Lights implements ILights {
  private readonly config: IConfig['lights']
  private readonly appConfig: IConfig['app']
  private readonly logger: ILogger

  private readonly api: HueApi
  private connected: boolean = false
  private lights: ILight[] = []
  private readonly lightState: lightState.State

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.config = config.lights
    this.appConfig = config.app
    this.logger = logger.create('Lights', 'magenta')

    this.api = new HueApi(this.config.host, this.config.user)

    this.lightState = lightState.create(this.config.initialState)

    void this.connect()
  }

  public list: ILights['list'] = () => this.lights

  public toggle: ILights['toggle'] = async (name) => {
    if (!this.connected) {
      this.logger.error('Error toggling light', name)
      throw new Error(`Error toggling light: ${name}`)
    }

    const light = this.lights.find((l) => l.name === name)
    if (light !== undefined) {
      if (light.on) {
        await this.api.setLightState(light.id, this.lightState.off())
      } else {
        await this.api.setLightState(light.id, this.lightState.on())
      }
      await this.update()
      this.logger.log('toggled light', name)
    } else {
      this.logger.error('Error toggling light', name)
      throw new Error(`Error toggling light: ${name}`)
    }
  }

  private readonly connect = async (): Promise<void> => {
    try {
      await this.api.config()
      this.connected = true
    } catch (err) {
      this.logger.error('Error connecting to Hue Bridge')
    }

    if (this.connected) {
      await this.update()

      if (this.appConfig.environment !== 'development') {
        await this.reset()
      }

      this.logger.log(
        'lights',
        this.lights.reduce(
          (lights, light) => ({
            ...lights,
            [light.name]: light.on ? 'on' : 'off',
          }),
          {}
        )
      )
    } else {
      try {
        await this.discover()
      } catch (err) {
        throw new Error('Unable to connect to a Hue Bridge')
      }
    }
  }

  private readonly discover = async (): Promise<void> => {
    try {
      const bridges = await nupnpSearch()

      if (bridges.length > 0) {
        this.logger.log('Hue Bridges Found:')
        this.logger.log(JSON.stringify(bridges))
        this.logger.log(
          'please set up a user and add the data to the .env.local'
        )
        this.logger.log(
          'check out: https://developers.meethue.com/documentation/getting-started'
        )
      } else {
        this.logger.error('No Hue Bridges found on this network')
      }
    } catch (error) {
      this.logger.error(
        'Error discovering Hue Bridges',
        (error as Error).message
      )
      throw new Error('Could not discover any Hue Bridges')
    }
  }

  private readonly update = async (): Promise<void> => {
    try {
      const state = await this.api.getFullState()

      this.lights = Object.keys(state.lights).map((id) => ({
        id,
        name: state.lights[id].name,
        on: state.lights[id].state.on,
        toggle: async () => await this.toggle(state.lights[id].name),
      }))
    } catch (error) {
      this.logger.error('Error updating state', error)
    }
  }

  private readonly reset = async (): Promise<void> => {
    await Promise.all(
      this.lights.map(async (light) => {
        if (light.on) {
          await light.toggle()
        }
      })
    )
    await this.update()
  }
}

export default Lights
