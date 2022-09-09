import { req } from '../utils/request'
import api from './index'

export function setDriver (parameter) {
    return req.request({
        url: api.truckSetDriver,
        method: 'post',
        params: parameter
    })
}

export function getList (parameter) {
    return req.request({
        url: api.getTruckList,
        method: 'post',
        params: parameter
    })
}