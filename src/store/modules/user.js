import Vue from 'vue'
import { login } from '@/api/login'
import { USER_INFO } from '@/store/mutation-types'

const user = {
  state: {
    name: '',
    avatar: '',
    info: {}
  },

  mutations: {
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          console.log(response)
          if (response.code == 200) {
            const userInfo ={
              id: response.data.admin.id,
              userName: response.data.admin.name,
              token: response.data.token
            }
            // userInfo.id = response.data.data[0].user_id
            // userInfo.name = response.data.data[0].user.user_nm
            // userInfo.token = response.data.data[0].user.access_token
            commit('SET_INFO', userInfo)
            commit('SET_NAME', userInfo.userName)
            Vue.ls.set(USER_INFO, userInfo, 3 * 60 * 60 * 1000)
            resolve()
          } else {
            reject(response.msg)
          }
        }).catch(error => {
          console.log(error)
          reject("未知异常")
        })
      })
    },
    setUserInfo ({ commit }) {
      var datas = Vue.ls.get(USER_INFO)
      var info = datas
      commit('SET_INFO', info)
      commit('SET_NAME', info.userName)
      Vue.ls.set(USER_INFO, datas, 3 * 60 * 60 * 1000)
    },


    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_NAME', '')
        commit('SET_INFO', {})
        Vue.ls.remove(USER_INFO)
        resolve()
      })
    }

  }
}

export default user
