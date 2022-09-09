import { req } from '../utils/request'
import api from './index'

export function addInfo (parameter) {
    return req.request({
        url: api.addStoreInfo,
        method: 'post',
        params: parameter
    })
}

export function getList (parameter) {
    return req.request({
        url: api.getStoreList,
        method: 'post',
        params: parameter
    })
}