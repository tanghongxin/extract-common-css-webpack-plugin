import webpack from 'webpack'
import path from 'path'
import nodeExternals from 'webpack-node-externals'

const config: webpack.Configuration = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.ts'),
  experiments: {
    outputModule: true,
  },
  output: {
    chunkFormat: 'module',
    libraryTarget: 'module',
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  }
}

export default config
