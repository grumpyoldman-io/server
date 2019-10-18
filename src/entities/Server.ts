import { createServer, Server as HttpServer, RequestListener } from 'http'
import { injectable, inject } from 'inversify'

import { IServer, IConfig, ILogger } from '../constants/interfaces'
import { TYPES, IRoutes } from '../constants/types'

@injectable()
class Server implements IServer {
  public name: string

  private _config: IConfig['server']
  private _logger: ILogger

  private listening: boolean = false
  private server: HttpServer

  private routes: IRoutes = {
    get: {},
    post: {}
  }

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.server = createServer(this.handleRequest)
    this._config = config.server
    this._logger = logger.create('Server', 'blue')

    this.name = this._config.name
  }

  public listen = () => {
    this.server.listen(this._config.port)
    this.listening = true

    this._logger.info(`listening on port ${this._config.port}`).force()
  }

  public close = () => {
    if (this.listening) {
      this.server.close()
      this._logger.info(`stopped listening`)
    }
  }

  public get: IServer['get'] = (route, handler) =>
    (this.routes.get[route] = handler)
  public post: IServer['post'] = (route, handler) =>
    (this.routes.post[route] = handler)

  private handleRequest: RequestListener = (req, res) => {
    const method = (req.method && req.method.toLowerCase()) || 'get'
    const url = (req.url && req.url.toLowerCase()) || ''

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Content-Security-Policy', `default-src 'self'`)
    res.setHeader('X-Content-Type-Options', `nosniff`)
    res.setHeader('X-Frame-Options', `deny`)
    res.setHeader('X-Powered-By', 'Buddy the guinea pig')

    if (method !== 'get' && method !== 'post') {
      res.statusCode = 405
      return res.end()
    }

    if (url.endsWith('favicon.ico')) {
      res.statusCode = 404
      return res.end()
    }

    if (
      req.headers.accept &&
      !req.headers.accept.includes('application/json')
    ) {
      res.statusCode = 406
      return res.end()
    }

    res.setHeader('Content-Type', 'application/json')

    if (this.routes[method] && this.routes[method][url]) {
      this.routes[method][url]((data = { message: 'ok' }, statusCode = 200) => {
        res.statusCode = statusCode
        res.end(JSON.stringify(data))
      })
    } else {
      res.statusCode = 404
      res.end(`{"error":"Not Found"}`)
    }
  }
}

export default Server
