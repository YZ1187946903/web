import api from './index'
import { req } from '@/utils/request'
export const editPayPassword=(data)=>{
  return req.post(api.editPayPassword,data)
}