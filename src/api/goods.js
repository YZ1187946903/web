import { req } from '../utils/request'
import api from './index'

export function addInfo (parameter) {
    return req.request({
        url: api.addgoods,
        method: 'post',
        params: parameter
    })
}

export function getList (parameter) {
    return req.request({
        url: api.getGoodsList,
        method: 'post',
        params: parameter
    })
}

export function addStock (parameter) {
    return req.request({
        url: api.addGoodsStock,
        method: 'post',
        params: parameter
    })
}