import { req } from '../utils/request'
import api from './index'

export function del (parameter) {
    console.log(parameter)
    return req.request({
        url: api.transportTempDelall,
        method: 'post',
        params: parameter
    })
}

export function getTempList (parameter) {
    return req.request({
        url: api.transportTempList,
        method: 'post',
        params: parameter
    })
}

export function add (parameter) {
    return req.request({
        url: api.transportTempAdd,
        method: 'post',
        params: parameter
    })
}