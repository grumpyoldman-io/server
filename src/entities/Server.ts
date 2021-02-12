import { createServer, Server as HttpServer, RequestListener } from 'http'
import { injectable, inject } from 'inversify'
import { match, MatchResult } from 'path-to-regexp'
// import { match } from 'path-to-regexp'

import {
  IServer,
  IConfig,
  ILogger,
  IRequest,
  IRoutes,
} from '../constants/interfaces'
import { TYPES } from '../constants/types'

@injectable()
class Server implements IServer {
  public name: string

  private readonly config: IConfig['server']
  private readonly logger: ILogger

  private listening: boolean = false
  private readonly server: HttpServer

  private readonly routes: IRoutes = {
    get: {},
    post: {},
    delete: {},
  }

  public constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.config = config.server
    this.logger = logger.create('Server', 'blue')

    this.server = createServer(this.handleRequest)
    this.name = this.config.name
  }

  public addRoutes = (routes: IRoutes): Server => {
    Object.keys(routes).forEach((method) => {
      Object.keys(routes[method]).forEach((route) => {
        this.routes[method][route] = routes[method][route]
      })
    })

    return this
  }

  public listen = (): Server => {
    this.server.listen(this.config.port)
    this.listening = true

    this.logger.info(`Listening on port ${this.config.port}`).force()

    return this
  }

  public close = (): Server => {
    if (this.listening) {
      this.server.close()
      this.listening = false
      this.logger.info('stopped listening')
    }

    return this
  }

  private readonly handleRequest: RequestListener = (req, res) => {
    const method = req.method?.toLowerCase() ?? 'get'
    const url = req.url?.toLowerCase() ?? ''

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Content-Security-Policy', "default-src 'self'")
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'deny')
    res.setHeader('X-Powered-By', 'A bunch of guinea pigs')

    if (method !== 'get' && method !== 'post') {
      res.statusCode = 405
      return res.end()
    }

    if (url.endsWith('favicon.ico')) {
      res.statusCode = 404
      return res.end()
    }

    if (
      req.headers.accept?.includes('application/json') !== true &&
      req.headers.accept?.includes('application/*') !== true &&
      req.headers.accept?.includes('*/*') !== true
    ) {
      res.statusCode = 406
      return res.end()
    }

    res.setHeader('Content-Type', 'application/json')

    let matchedRoute:
      | (MatchResult<IRequest['params']> & { route: string })
      | undefined
    Object.keys(this.routes[method]).find((path) => {
      const findMatch = match(path, { decode: decodeURIComponent })(url)
      if (typeof findMatch === 'object') {
        matchedRoute = {
          ...(findMatch as MatchResult<IRequest['params']>),
          route: path,
          params: { ...findMatch.params },
        }
        return true
      }
      return false
    })

    if (matchedRoute !== undefined) {
      this.routes[method][matchedRoute.route](
        ({
          ...req,
          params: matchedRoute.params,
        } as unknown) as IRequest,
        (data = { message: 'ok' }, statusCode = 200) => {
          res.statusCode = statusCode
          res.end(JSON.stringify(data))
        }
      )
    } else {
      res.statusCode = 404
      res.end('{"error":"Not Found"}')
    }
  }
}

export default Server
