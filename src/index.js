
import VueCompile from './vueCompile'

export default class OComp {

  constructor (option) {
    this.VUE_COMPONENTS = 'vue'
    this.WX_COMPONENTS = 'wx'
    this.type = [this.VUE_COMPONENTS, this.WX_COMPONENTS]
    return this.render(option)
  }

  // 渲染
  render (option) {
    const componentsArr = option.component
    if (!componentsArr || !Array.isArray(componentsArr)) throw new Error('组件列表必须为数组')
    const TYPE = process.env.COMPILE_ENV
    if (!(this.type.indexOf(TYPE) > -1)) throw new Error('组件类型错误')
    if (TYPE === this.VUE_COMPONENTS) return new VueCompile(option)
  }

}