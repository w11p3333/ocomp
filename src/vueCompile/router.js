// @flow
import type { 
  VUE_INSTANCE, 
  ROUTER_OBJECT
} from './type'

// 配置vue router 实例
export default function (vueInstance: VUE_INSTANCE): ROUTER_OBJECT {
  const TYPE = process.env.COMPILE_ENV
  let router = {}
  let pushHandler = {}
  let popHandler = {}
  if (TYPE === 'vue') {
    if (!vueInstance.$route || !vueInstance.$router) throw new Error('vue路由api依赖 vue-router')
    popHandler = {
      get: _ => _ => history.back()
    }
    router = Object.assign(vueInstance.$router, vueInstance.$route)
  } else if (TYPE === 'weex') {
    var navigator = weex.requireModule('navigator')
    if (!navigator) throw new Error('weex路由api依赖 weex navigator')
    pushHandler = {
      get: _ => path => {
        var navigator = weex.requireModule('navigator')
        if (!navigator) throw new Error('weex路由api依赖 weex navigator')
        const url = weex.config.bundleUrl.split('/').slice(0, -1).join('/') + '/' + path + '.js' // 将a.js的绝对地址转为b.js的绝对地址
        navigator.push({ url, animated: "true" })
      }
    }
    popHandler = {
      get: _ => _ => navigator.pop({ animated: 'true' })
    }
    // 添加push对象
    Reflect.defineProperty(router, 'push', pushHandler)
  }
  // 添加pop对象
  Reflect.defineProperty(router, 'pop', popHandler)
  return router
}