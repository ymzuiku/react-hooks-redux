const tip = require('./webpack.tip')();
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'web',
  mode: tip.mode.production,
  devtool: tip.devtool.sourceMap,
  entry: {
    index: tip.paths.entry,
  },
  output: {
    libraryTarget: 'umd',
    path: tip.paths.output,
    pathinfo: true,
    filename: 'index.js',
    chunkFilename: '[name]_.chunk.js',
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: tip.resolve.extensions,
    alias: tip.resolve.alias,
    plugins: [],
  },
  module: {
    rules: [
      tip.module.rules.eslint,
      tip.module.rules.cssLoader,
      tip.module.rules.stylusLoader,
      tip.module.rules.urlLoader,
      tip.module.rules.fileLoader,
      tip.module.rules.sourceMapLoader,
      tip.module.rules.tsLodaer,
      tip.module.rules.babelLoaderBuild,
    ],
  },
  devServer: tip.devServer,
  plugins: [
    tip.plugins.DefinePlugin,
    tip.plugins.FastUglifyJsPluginDev,
    tip.plugins.CopyWebpackPlugin,
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};
