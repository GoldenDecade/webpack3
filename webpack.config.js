const path = require('path')
const packagejson = require("./package.json");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const extractCSS = new ExtractTextPlugin('stylesheets/[name]-css.css');
// const extractStylus = new ExtractTextPlugin('stylesheets/[name]-stylus.css');

const webpack = require('webpack') // devserver 实现局部刷新
//fix bug:  Make sure to include VueLoaderPlugin in your webpack config.
// const { VueLoaderPlugin } = require('vue-loader') // fix bug:  Make sure to include VueLoaderPlugin in your webpack config.
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // fix bug:  Make sure to include VueLoaderPlugin in your webpack config.

const isProduction = process.env.NODE_ENV.includes('production', 0); // 在命令行中配置的时候 会发现process.env.NODE_ENV 长度比production长  原因是后面有空格，因此使用includes(); 不过最好还是在js中配置，而不是在命令行中配置
console.log(process.env.NODE_ENV);
console.log(process.env.NODE_ENV.length);
// const isProduction = process.env.NODE_ENV;
console.log('isProduction: ' + isProduction);
/*const cssConfig = isProduction ? ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader']
}) : ['style-loader', 'css-loader']*/
const cssConfig = isProduction ? ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', { loader: 'postcss-loader'}]
}) : ['style-loader', 'css-loader',
  { loader: 'postcss-loader'}]
const stylusConfig = isProduction ? ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [{ loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader' },
    'stylus-loader']
}) : ['style-loader',
  { loader: 'css-loader', options: { importLoaders: 1 } },
  { loader: 'postcss-loader'},
  'stylus-loader']
/*const stylusConfig = isProduction ? ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [{ loader: 'css-loader', options: { importLoaders: 1 } },  'stylus-loader']
}) : ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } },  'stylus-loader']*/
module.exports = {
  entry: {
    'polyfills': './src/promise-polyfill.js',
    'main': './src/main.js',
    'first': './src/first.js',
    // 'vendor': Object.keys(packagejson.dependencies)//获取生产环境依赖的库
  },
  resolve: {
    alias: {
      //fix bug:   [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
      //原因： 因为template选项不能使用，如果不加vue/dist/vue.js，那么import vue from 'vue';引入的就是vue.common.js;其实要引入的是vue.js
      //为什么?
      //Vue 最早会打包生成3个文件，一个是runtime only的文件 vue.common.js; 一个是compiler only 的文件compiler.js, 一个runtime + compiler 的文件vue.js; 如果要使用template的话就一定要用compiler.js； 所以选用vue.js
      'vue': 'vue/dist/vue.js'
    }
  },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    contentBase: 'dist',
    compress: true,
    port: 9000,
    open: true,
    hot: true,  // devserver 实现局部刷新
  },
  output: {
    // publicPath: '',
    path: __dirname + '/dist',
    filename: isProduction ?  '[name][chunkhash:8].js' : '[name][hash:8].js', // hash（dev） 与 chunkhash
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"]
      },
      {
        test: /\.js$/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        // use: extractCSS.extract({
        use: cssConfig
      },
      {
        test: /\.styl|us$/, //  要解决stylus和styl两种文件
        // use: extractStylus.extract({
        use: stylusConfig
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      // _: 'lodash', // 用 _ 指代 lodash 库,但是会引入lodash整个库，比较大
      drop: ['lodash', 'drop'], //由于只是用_.join方法,所以设置join: [module('lodash'), child('join'), ...children?]; 暴露某个模块中单个导出值，只需通过一个“数组路径”进行配置（例如 [module, child, ...children?]）
    }),
    new HtmlWebpackPlugin({// 相对于webpackConfig.output.path路径而言的，不是相对于当前项目目录结构的。
      title: 'learn&test webpack3',
      filename: 'index.html',
      template: './src/index.html',// 相对于webpackConfig.output.path路径（这里配置的是dist目录）而言的，所以这里是./src
      favicon: './src/assets/images/favicon.ico',
      inject: 'body', // 1. true/body  2. head 3. false
      chunks: [ 'common', 'vendor', 'polyfills', 'main' ],

      // chunks: ['main', 'vendor'], //在多页面应用时区别不同的entry (及其需要)
      minify: {
        collapseWhitespace: true
      },
      // hash: true, // cdn之类的  true的话，script引入的js文件后面会有?hash值
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, './'),
      verbose: false
    }),

    new VueLoaderPlugin(), // fix bug:  Make sure to include VueLoaderPlugin in your webpack config.
    // devserver 实现局部刷新
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.

    new webpack.optimize.UglifyJsPlugin(),// 压缩代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',// 这个文件不需要在页面中引入 可能是因为chunks是 vendor
      filename: '[name].js',
      chunks: ['vendor']
    }),
    new webpack.optimize.CommonsChunkPlugin({ // 将entry中的公共文件抽离出来了
      name: 'common', // 这些文件需要在页面中引入  HTMLwebpackplugin的chunks
      filename: '[name].js',
      chunks: ['first','main']//从first.js和second.js中抽取commons chunk
    }),
    new webpack.optimize.CommonsChunkPlugin({ // 将第三方库抽离出来了
      name: 'vendor',
      filename: '[name].js',
      minChunks: function (module,count) {
        // console.log(module.resource,`引用次数${count}`);
        //"有正在处理文件" + "这个文件是 .js 后缀" + "这个文件是在 node_modules 中"
        return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
        )
      }
    }),
// extractCSS,
    // extractStylus,
    new ExtractTextPlugin({ //必须写在webpack.optimize.CommonsChunkPlugin的下面
      filename: 'style.css',
      disable: !isProduction, // 生产环境使用； 开发时候不使用，所以开发时候disable为true
      allChunks: true,// 使用CommonsChunkPlugin 的时候  这里必须是true
    }),
  ]
}