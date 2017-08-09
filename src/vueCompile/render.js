// @flow
import type { CONSTRUCTOR_OPTION } from './type'
import getProps from './props'
import getMethods from './methods'
import getContainerStyle from './style'
// 生成vue render方法
export default function (option: CONSTRUCTOR_OPTION): Function {
  const components = option.component

  function render (vueInstance, h, components, option) {
    if (option) {
      const { prop, method } = option
      return h(components, {
        props: getProps(vueInstance, prop),
        on: getMethods(vueInstance, method)
      }) // 若存在组件配置
    } else return h(components) // 不存在组件配置
  }

  return function (h: Function) {
    const vueInstance = this // this指向vue实例
    return Array.isArray(components) ? 
    h('div', getContainerStyle(option.style), components.map(({ components, option }) => render(vueInstance, h, components, option)))
    : render(vueInstance, h, components.components, components.option)
  }
}