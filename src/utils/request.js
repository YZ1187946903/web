import axios from 'axios'
import {
  VueAxios
} from './axios'
import queryString from 'query-string'
import Vue from 'vue'
import { USER_INFO } from '@/store/mutation-types'
// 创建 axios 实例  公共
const service = axios.create({
  baseURL: 'http://127.0.0.1:8081', // api base_url
  timeout: 12000, // 请求超时时间s
  withCredentials: true
})


const serviceLogin = axios.create({
  baseURL: 'https://gateway.4006820016.com/api', // api base_url
  timeout: 12000, // 请求超时时间s
  headers: {
    'Content-Type': "application/json;charset=utf-8"
  }
})


var url
// 请求拦截
service.interceptors.request.use(config => {
  let ts= Vue.ls.get(USER_INFO)
  console.log(ts) 
  if(ts){
    config.headers['token'] = ts.token;
  }
  return config
})

// 响应拦截
service.interceptors.response.use((response) => {
  return response.data
})

class Request {
  //登录
  static async login (data) {
    return service.post("admin/login", queryString.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // get请求
  static async get (url, param) {
    return service.get(url, {
      params: param
    })
  }

  // post请求
  static async post (url, data) {
    return service.post(url, queryString.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }


  // post请求json
  static async postJson (url, data) {
    return service.post(url, data, {
    })
  }

  // put请求
  static async put (url, data) {
    return service.put(url, queryString.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
  // putjson
  static putJson (url, data) {
    return service.put(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
  // patch请求
  static async patch (url, data) {
    return service.patch(url, queryString.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static async patchJson (url, data) {
    return service.patch(url, data, {})
  }
  // delete请求
  static async delete (url, param) {
    return service.delete(url, {
      params: param
    })
  }
  // oauth2授权
  static async oauth (url, data) {
    if (!data.grant_type) {
      data.grant_type = 'password'
    }
    return axios.request({
      method: 'post',
      url: url,
      data: queryString.stringify(data),

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic YXBwOmFwcHNlY3JldA=='

      }
    })
  }
  // request请求
  static async request (config) {
    return service.request(config)
  }


}
// 安装vue配置
const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}
// 导出供用户使用
export {
  installer as VueAxios,
  Request as req

}
