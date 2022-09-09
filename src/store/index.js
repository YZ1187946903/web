import Vue from 'vue'
import Vuex from 'vuex'
import sendGoods from './modules/sendGoods'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import modal from './modules/modal'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    sendGoods,
    modal
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters:{
    ...getters,
  }
})
