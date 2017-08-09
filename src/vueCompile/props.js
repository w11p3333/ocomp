// @flow
import type { 
  VUE_INSTANCE,
  COMPONENT_OBJECT_OPTION
 } from './type'

// 将props指向vue父组件实例
export default function (vueInstance: VUE_INSTANCE, props: Object): Object | void {
    if (!props) return
    const newProps = {}
    Object.keys(props).forEach(key => {
        const value = props[key]
        const prop = typeof value === 'string' && value.indexOf('$') === 0
        ? vueInstance[value.substring(1, value.length)]
        : value
        // 若是以$开头则为变量
        Reflect.set(newProps, key, prop)
    })
    return newProps
}