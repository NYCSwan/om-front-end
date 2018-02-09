const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: [
  'webpack-dev-server/client?http://0.0.0.0:3000',
  './src/index.js'
  ],
  devtool: "cheap-eval-source-map",
  output: {
    path: path.join(__dirname, "public"),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: require.resolve('./src/utils/dangerouslySetInnerHTML.loader'),
        exclude: /node_modules/
      }
    ]
  }
}
