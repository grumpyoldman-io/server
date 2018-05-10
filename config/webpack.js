const path = require('path')

module.exports = {
  entry: [
    './config/polyfills.js',
    './src/index.js'
  ],
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  externals: {
    mqtt: 'commonjs mqtt',
    'mqtt-packet': 'commonjs mqtt-packet'
  }
}
