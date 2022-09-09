import { req } from '../utils/request'
import api from './index'

export function getList (parameter) {
    return req.request({
        url: api.getInfoList,
        method: 'post',
        params: parameter
    })
}

export function getListByNeed (parameter) {
    return req.request({
        url: api.getNeedGoodListByNeed,
        method: 'post',
        params: parameter
    })
}

export function tranlist (parameter) {
    return req.request({
        url: api.tranlist,
        method: 'post',
        params: parameter
    })
}