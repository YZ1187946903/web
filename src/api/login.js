import api from './index'
import { req } from '@/utils/request'

/**
 * 登录方法
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return req.login(parameter)
}

/**
 * 发送短信登录接口
 * @param parameter
 * @returns {*}
 */
export function getSmsCaptcha (parameter) {
  return req.post({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}
