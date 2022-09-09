import api from './index'
import { req } from '@/utils/request'

/**
 * 发送短信
 * @param data
 * @returns {*}
 */
export const sendSms=(data)=>{
    return req.post(api.sendSms,data);
}
export const editPwd=(data)=>{
  return req.post(api.editPwd,data);
}