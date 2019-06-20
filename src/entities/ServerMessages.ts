import { injectable, inject } from 'inversify'
import mqtt, { MqttClient, OnMessageCallback } from 'mqtt'

import { IServerMessages, IConfig, ILogger } from '../constants/interfaces'
import { TYPES, IMessageSubscriber, IMessage } from '../constants/types'

@injectable()
class ServerMessages implements IServerMessages {
  private _config: IConfig['mqtt']
  private _logger: ILogger

  private client: MqttClient | null = null
  private subscribers: IMessageSubscriber[] = []

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this._config = config.mqtt
    this._logger = logger.create('ServerMessages')
  }

  public listen = () => {
    this.client = mqtt.connect(this._config.host)
    this.client.on('message', this.message)
    this.client.on('connect', this.connected)
  }

  public close = () => {
    if (this.client && this.client.connected) {
      this._logger.info(`closing ${this._config.host}`)

      this.client.end()
      this.client = null
    }
  }

  public on: IServerMessages['on'] = callback => {
    this.subscribers.push(callback)
  }

  private message: OnMessageCallback = (topic, payload) => {
    let data: any = null
    if (payload.toString().length) {
      try {
        data = JSON.parse(payload.toString())
      } catch (err) {
        this._logger.error('Error parsing payload from message', err.message)
      }

      this.subscribers.forEach(subscriber =>
        subscriber({
          topic,
          payload: data
        } as IMessage)
      )
    } else {
      this.subscribers.forEach(subscriber =>
        subscriber({
          topic
        } as IMessage)
      )
    }
  }

  private connected = () => {
    this._config.topics.forEach(topic => {
      if (this.client !== null) {
        this.client.subscribe(topic)
      }
    })

    this._logger.info(
      `listening to ${this._config.host} for topics ${this._config.topics.join(
        ','
      )}`
    )
  }
}

export default ServerMessages
