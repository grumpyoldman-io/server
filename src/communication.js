// Ensure environment variables are read.
import '../config/env'

import mqtt from 'mqtt'

const topics = Object.keys(process.env)
  .filter(envVar => envVar.startsWith('MQTT_BUTTON_'))
  .map(envVar => ({
    id: process.env[envVar],
    button: parseInt(envVar.replace('MQTT_BUTTON_', ''))
  }))

const init = emit =>
  new Promise(resolve => {
    const client = mqtt.connect(
      `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
    )

    client.on('message', topic => {
      const match = topics.find(({ id }) => id === topic)
      if (match) {
        emit(match.button)
      }
    })

    client.on('connect', () => {
      topics.forEach(({ id }) => {
        client.subscribe(id)
      })

      console.log(
        `listening to mqtt://${process.env.MQTT_HOST}:${
          process.env.MQTT_PORT
        } for buttons ${topics.map(({ button }) => button).join(',')}`
      )

      resolve()
    })
  })

export default init
