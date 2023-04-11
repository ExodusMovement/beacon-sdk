const path = require('path')
const webpack = require('webpack')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'beacon',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      libsodium: require.resolve('@exodus/libsodium-wrappers')
    },
    fallback: {
      crypto: false,
      fs: false,
      stream: require.resolve('stream-browserify')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ]
}
