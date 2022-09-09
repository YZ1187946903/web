import { req } from '../utils/request'
import api from './index'

export function add (parameter) {
  return req.request({
    url: api.addTransport,
    method: 'post',
    params: parameter
  })
}

export function getTranList (parameter) {
  return req.request({
    url: api.transportList,
    method: 'post',
    params: parameter
  })
}

export function getInfo (parameter) {
  return req.request({
    url: api.transportInfo,
    method: 'post',
    params: parameter
  })
}

export function handlex (parameter) {
  return req.request({
    url: api.transportHandlex,
    method: 'post',
    params: parameter
  })
}

