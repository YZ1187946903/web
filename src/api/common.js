/**
 * 一些公共接口
 */
import api from './index'
import { req } from '@/utils/request'
// 意见反馈
export const addFeedBack = (data) => {
  return req.post(api.feedback, data)
}
// 获取客服信息
export const getCustomerService = () => {
  return req.post(api.getCustomerServiceInfo)
}
// 对比支付密码
export const contrastPassword = (params) => {
  return req.post(api.checkPassword, params)
}
