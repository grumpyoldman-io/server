'use strict'

import path from 'path'
import fs from 'fs'

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

// config after eject: we're in ./config/
export default {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('build'),
  appSrc: resolveApp('src'),
  appPackageJson: resolveApp('package.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules')
}
