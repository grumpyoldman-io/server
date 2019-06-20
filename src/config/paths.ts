import fs from 'fs'
import path from 'path'

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath: string): string =>
  path.resolve(appDirectory, relativePath)

export default {
  dotenv: resolveApp('.env'),
  appDirectory,
  appBuild: resolveApp('build'),
  appSrc: resolveApp('src'),
  appPackageJson: resolveApp('package.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules')
}
