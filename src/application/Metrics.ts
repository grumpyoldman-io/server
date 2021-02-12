import { injectable } from 'inversify'

import { IMetrics } from '../constants/interfaces'

type ID = string

@injectable()
class Metrics implements IMetrics {
  private cache: Record<ID, [number, number]> = {}

  public readonly start: IMetrics['start'] = (id) => {
    this.cache[id] = process.hrtime()
    return this.stop(id)
  }

  private readonly stop = (id: ID) => (): number => {
    const end = process.hrtime(this.cache[id])
    return end[1] / 1000000 + end[0] * 1000
  }
}

export default Metrics
