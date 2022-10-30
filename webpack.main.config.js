const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const copy = new CopyWebpackPlugin({
  patterns: [{ from: path.resolve(__dirname, 'assets'), to: 'assets' }],
})

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  plugins: [
    copy,
  ]
};