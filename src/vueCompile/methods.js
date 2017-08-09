// @flow
import type { 
  VUE_INSTANCE,
  COMPONENT_OBJECT_OPTION
 } from './type'

// 将methods指向vue父组件实例
export default function (vueInstance: VUE_INSTANCE, methods: Object): Object | void {
    if (!methods) return
    const newMethod = {}
    Object.keys(methods).forEach(key => {
        const value = methods[key]
        if (!value.indexOf('$') === 0) throw new Error('定义组件的method 必须使用$开头的字符串表示变量')
        Reflect.set(newMethod, key, vueInstance[value.substring(1, value.length)])
    })
    return newMethod
}