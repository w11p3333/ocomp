
import VueCompile from './vueCompile'
import WxCompile from './wxCompile'


export default class OComp {

  constructor (option) {
    this.VUE_COMPONENTS = 'vue'
    this.WX_COMPONENTS = 'wx'
    this.WEEX_COMPONENTS = 'weex'
    let type = [this.VUE_COMPONENTS, this.WX_COMPONENTS, this.WEEX_COMPONENTS]
    
    if (!option) throw new Error('构造参数不存在')
    const componentsArr = option.component
    if (!componentsArr || !Array.isArray(componentsArr)) throw new Error('组件列表必须为数组')

    const TYPE = process.env.COMPILE_ENV
    if (!(type.indexOf(TYPE) > -1)) throw new Error('组件类型错误')

    if (TYPE === this.VUE_COMPONENTS || TYPE === this.WEEX_COMPONENTS) return new VueCompile(option)
    else if (TYPE === this.WX_COMPONENTS) return new WxCompile(option)
  }

}
