module.exports = {
  // parser: 'sugarss', // css代码格式检测工具  一般不用
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      autoprefixer: true
    },
    'cssnano': {}
  }
}