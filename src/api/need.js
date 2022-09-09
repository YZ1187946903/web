import { req } from '../utils/request'
import api from './index'

export function getInfo (parameter) {
    return req.request({
        url: api.getNeedInfo,
        method: 'post',
        params: parameter
    })
}

export function getList (parameter) {
    return req.request({
        url: api.getNeedList,
        method: 'post',
        params: parameter
    })
}

export function checkNeed (parameter) {
    return req.request({
        url: api.checkNeed,
        method: 'post',
        params: parameter
    })
}