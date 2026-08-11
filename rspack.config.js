const path = require('path')
const { CopyRspackPlugin, HtmlRspackPlugin } = require('@rspack/core')

module.exports = {
  context: __dirname,
  entry: './script/main.js',
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      ...(process.env.HAPPY_BIRTHDAY_SHARED_NODE_MODULES ? [process.env.HAPPY_BIRTHDAY_SHARED_NODE_MODULES] : []),
      'node_modules'
    ]
  },
  devServer: {
    port: 1113,
    host: '127.0.0.1',
    open: false,
    hot: true,
    static: {
      directory: path.resolve(__dirname, 'dist')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].js',
    clean: true,
    publicPath: ''
  },
  performance: {
    hints: false
  },
  plugins: [
    new HtmlRspackPlugin({
      template: './index.html',
      inject: 'body'
    }),
    new CopyRspackPlugin({
      patterns: [
        { from: 'customize.json', to: 'customize.json' },
        { from: 'style', to: 'style' },
        { from: 'img', to: 'img' },
        { from: 'music', to: 'music' },
        { from: 'fonts', to: 'fonts' },
        { from: 'assets', to: 'assets', noErrorOnMissing: true }
      ]
    })
  ]
}
