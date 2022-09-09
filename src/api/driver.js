import { req } from '../utils/request'
import api from './index'

export function addInfo (parameter) {
    return req.request({
        url: api.addDriverInfo,
        method: 'post',
        params: parameter
    })
}

export function getList (parameter) {
    return req.request({
        url: api.getDriverList,
        method: 'post',
        params: parameter
    })
}
