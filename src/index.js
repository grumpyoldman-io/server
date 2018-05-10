'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

if (process.env.NODE_ENV === 'development') {
  require('piping')({
    hook: true,
    ignore: /(\/\.|~$|node_modules\/$)/i
  })
}

// Packages
const paths = require('../config/paths')
const communication = require('./communication');
const hue = require('./hue');
const appName = require(paths.appPackageJson).name;

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

        console.log(`${appName} has started :)`)
      })
  })