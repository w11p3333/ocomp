// @flow
import type { VUE_INSTANCE } from './type'
import getRouter from './router'

// vue实例上挂载自定义对象
export default function (vueInstance: VUE_INSTANCE): void {
  const properties = new Map()
  // 定义setData
  properties.set('setData', {
    // 调用setData时遍历挂载在vue实例下的data 并赋值
    get: _ => obj => Object.keys(obj).map(key => Reflect.has(vueInstance, key) && 
    Reflect.set(vueInstance, key, obj[key]) )
  })
  // 定义data proxy 对象
  properties.set('data', {
    get: _ => vueInstance
  })
  // 定义fetch 对象
  properties.set('fetch', {
    get: _ => weex.requireModule('stream').fetch
  })
  // 定义config 对象
  properties.set('config', {
    get: _ => weex.config
  })
  // 定义router 对象
  properties.set('router', {
    get: _ => getRouter(vueInstance)
  })
  // 遍历并定义
  properties.forEach((handler, name) => {
    Reflect.get(vueInstance, name) === undefined &&
    Reflect.defineProperty(vueInstance, name, handler)
  })
}