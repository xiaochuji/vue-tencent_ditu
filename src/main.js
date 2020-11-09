import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
import App from './App'
import store from './store'
import router from './router'
import axios from '../node_modules/axios'
Vue.prototype.$axios = axios

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
// import BaiduMap from 'vue-baidu-map'

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(Element, VueQuillEditor, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

import '@/styles/common.scss'

// import Sw from 'sw-ui'
// Vue.use(Sw)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// Vue.use(BaiduMap, {
//   /* 需要注册百度地图开发者来获取你的ak */
//   ak: 'PfGDqndsoz5ta5k2ZDoIXUBnKlIGnSaN'
// })

new Vue({
  el: '#app',
  router,
  axios,
  store,
  i18n,
  render: h => h(App)
})
