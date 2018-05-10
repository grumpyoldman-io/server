// Ensure environment variables are read.
import '../config/env'

import { HueApi, nupnpSearch } from 'node-hue-api'

const init = () => new Promise((resolve, reject) => {
  if (
    !process.env.HUE_HOST ||
    !process.env.HUE_USER ||
    process.env.HUE_USER === 'X'
  ) {
    nupnpSearch()
      .then((bridges) => {
        console.log(`Hue Bridges Found:\n${JSON.stringify(bridges)}`)
        console.log(`please set up a user and add the data to the .env.loval`)
        console.log(`check out:https://developers.meethue.com/documentation/getting-started`)

        reject(new Error('No ENV vars found'))
      })
  } else {
    console.log(`Loading Hue settings from ${process.env.HUE_HOST}, ${process.env.HUE_USER}`)
    const api = new HueApi(process.env.HUE_HOST, process.env.HUE_USER)

    api.getFullState()
      .then((result) => {
        let lights = {}

        Object.keys(result.lights).forEach((lightId) => {
          lights[lightId] = {
            ...result.lights[lightId],
            id: lightId,
            toggle: () => {
              api.lightStatus(lightId)
                .then((light) => {
                  console.log('set', lightId, !light.state.on)
                  api.setLightState(lightId, {
                    on: !light.state.on
                  })
                })
            }
          }
        })

        resolve(lights)
      })
  }
})

export default init
