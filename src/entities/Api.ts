import { createServer, Server, RequestListener } from 'http'
import { injectable, inject } from 'inversify'

import { IApi, IConfig, ILogger } from '../constants/interfaces'
import { TYPES, IRequestSubscriber, IRequest } from '../constants/types'

@injectable()
class API implements IApi {
  private _config: IConfig['api']
  private _logger: ILogger

  private listening: boolean = false
  private server: Server
  private subscribers: IRequestSubscriber[] = []

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.server = createServer(this.handleRequest)
    this._config = config.api
    this._logger = logger.create('API')
  }

  public listen = () => {
    this.server.listen(this._config.port)
    this.listening = true

    this._logger.info(`listening on ${this._config.port}`)
  }

  public close = () => {
    if (this.listening) {
      this.server.close()
      this._logger.info(`stopped listening`)
    }
  }

  public on: IApi['on'] = callback => {
    this.subscribers.push(callback)
  }

  private handleRequest: RequestListener = (req, res) => {
    this.subscribers.forEach(subscriber =>
      subscriber({
        url: req.url
      } as IRequest)
    )

    res.statusCode = 200
    res.end('ok')
  }
}

export default API
