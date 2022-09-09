import Vue from 'vue'
import store from '@/store/'
import {
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_TAB
} from '@/store/mutation-types'
import config from '@/config/defaultSettings'
// 启动初始化
export default function Initializer () {
  store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
  store.commit('TOGGLE_THEME', config.navTheme)
  store.commit('TOGGLE_LAYOUT_MODE',  config.layout)
  store.commit('TOGGLE_FIXED_HEADER', config.fixedHeader)
  store.commit('TOGGLE_FIXED_SIDERBAR', config.fixSiderbar)
  store.commit('TOGGLE_CONTENT_WIDTH', config.contentWidth)
  store.commit('TOGGLE_FIXED_HEADER_HIDDEN', config.autoHideHeader)
  store.commit('TOGGLE_WEAK',config.colorWeak)
  store.commit('TOGGLE_COLOR',  config.primaryColor)
  store.commit('TOGGLE_MULTI_TAB', config.multiTab)

  // last step
}
