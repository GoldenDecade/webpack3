import './common.css'
import './index.styl'
// import 'babel-polyfill'
import './rem'
import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
