process.env.NODE_ENV = 'production'
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
webpack(webpackConfig, (err, stats)=> {
  if(err) {
    console.log('err: '+err);
  }
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }))
})