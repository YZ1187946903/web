// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios, req } from './utils/request'
import VueAMap from './utils/amap'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
//时间
import getDate from './utils/DateUtils'
import vuedirectiveImagePreviewer from 'vue-directive-image-previewer'
import './assets/css/img_style.css'
Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(VueAMap)
Vue.use(vuedirectiveImagePreviewer)
Vue.prototype.$req = req
Vue.prototype.$getDate=getDate
new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')