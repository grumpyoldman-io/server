import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import paths from './paths'

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')]

const NODE_ENV = process.env.NODE_ENV || 'production'

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv
].filter(Boolean)

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (dotenvFile && fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile
      })
    )
  }
})

process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(paths.appDirectory, folder))
  .join(path.delimiter)

try {
  process.env.COMMIT_HASH = execSync('git rev-parse HEAD')
    .toString()
    .trim()

  process.env.VERSION = process.env.npm_package_version
} catch {
  // these optional ENV vars should be handled by the application
}
