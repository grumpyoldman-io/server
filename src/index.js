'use strict'

// Packages
import communication from './communication'
import hue from './hue'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

if (process.env.NODE_ENV === 'development') {
  require('piping')({
    hook: true,
    ignore: /(\/\.|~$|node_modules\/$)/i
  })
}

// Start
hue()
  .then((lights) => {
    console.log(`got lights:\n${Object.values(lights).map(({ id, name }) => `- ${name} (id: ${id})`).join('\n')}`)
    communication((buttonId) => {
      console.log(`got button ${buttonId}`)
      if (buttonId === 0) {
        lights['9'].toggle()
      } else if (buttonId === 1) {
        lights['10'].toggle()
      }
    })
      .then(() => {
        console.log(`Server has started :)`)
      })
      .catch((err) => {
        console.error(`\n\nSomething went wrong, ${err.message}`)
      })
  })
  .catch((err) => {
    console.error(`\n\nSomething went wrong, ${err.message}`)
  })
