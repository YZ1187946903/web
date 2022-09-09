import { req } from '../utils/request'
import api from './index'

export function addInfo (parameter) {
    return req.request({
        url: api.addWarehouseInfo,
        method: 'post',
        params: parameter
    })
}

export function getList (parameter) {
    return req.request({
        url: api.getWarehouseList,
        method: 'post',
        params: parameter
    })
}