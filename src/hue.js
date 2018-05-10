const { HueApi, nupnpSearch, lightState } = require('node-hue-api');

// Ensure environment variables are read.
require('../config/env');

if (!process.env.HUE_HOST || !process.env.HUE_USER) {
  nupnpSearch()
    .then((bridges) => {
      console.log('Hue Bridges Found: ' + JSON.stringify(bridges));
      console.log('please set up a user (https://developers.meethue.com/documentation/getting-started) and add the data to the .env.loval')
    });
}

const init = () => new Promise((resolve) => {
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
})

module.exports = init