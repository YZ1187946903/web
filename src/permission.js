import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { USER_INFO } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult', 'RetrievePwd', 'CommonAbout'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  
  //处理未登录的开发
  // const userInfo ={
  //   id: "123",
  //   userName: "123",
  //   token: "123"
  // }
  // Vue.ls.set(USER_INFO, userInfo, 3 * 60 * 60 * 1000)


  if (Vue.ls.get(USER_INFO)) {
      store.dispatch('setUserInfo')


    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/dashboard/workplace' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
