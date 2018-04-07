const webpack = require('webpack')
const path = require('path')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['babel-polyfill', './src/index'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {test: /\.tsx?$/, loader: 'ts-loader', options: {transpileOnly: true}},
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.(png|svg)$/, loader: 'file-loader'},
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
}
