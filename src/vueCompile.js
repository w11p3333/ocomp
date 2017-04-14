/*@flow*/
// vue实例的数据类型
type VUE_INSTANCE = {
   data : ?Function, // 数据
   methods : ?Object, // 转换后的实例事件
   render : Function, // 实例render函数
}
// vue路由实例
type ROUTER_OBJECT = {
  mode: string,
  currentRoute: Object,
  push: Function,
  pop: ?Function,
  replace: Function,
  go: Function,
  back: Function,
  forward: Function,
  path: string,
  params: Object,
  query: Object,
  hash: string,
  fullPath: string,
  name: ?string
}
// 组件配置项的数据类型
type COMPONENT_OBJECT_OPTION = {
  prop: ?Object, // 传入的组件参数
  props: ?Object, // 转换后的组件参数
  method: ?Object, // 传入的组件事件
  on: ?Object // 转换后的组件事件
}
// 组件的数据类型
type COMPONENT_OBJECT = {
  components: Object,
  option: ?COMPONENT_OBJECT_OPTION
}
// 组件数组
type COMPONENT_ARRAY = Array<COMPONENT_OBJECT>
// 传入的实例化参数
type CONSTRUCTOR_OPTION = {
   data : ?Object, // 数据
   method : ?Object, // 传入的实例事件
   component: COMPONENT_ARRAY
}

export default class VueCompile {

  constructor (option: CONSTRUCTOR_OPTION): VUE_INSTANCE {
    return this.makeVueInstance(option)
  }

    option: CONSTRUCTOR_OPTION
  // 生成vue实例
  makeVueInstance (option: CONSTRUCTOR_OPTION): VUE_INSTANCE {
    const render: Function = this.makeVueRender(option.component)
    const dataObj: ?Object = option.data
    return {
      methods: option.method || {},
      data: _ => dataObj || {},
      render
    }
  }

  // vue实现 render
  makeVueRender (components: COMPONENT_ARRAY): Function {
    var classSelf = this // this指向类
    return function (h: Function) {
    var vueInstanceSelf = this // this指向vue实例
    classSelf.makeVueRouter.call(vueInstanceSelf)
    return h('div', components.map(({ components, option }) => {
      if (option) {
        // 遍历以转换格式为vue组件配置格式
        classSelf.translateToVueProps.call(vueInstanceSelf, option)
        classSelf.translateToVueMethods.call(vueInstanceSelf, option)
        return h(components, option)
      } else {
        return h(components)
      }
      }))
    }
  }

  router: ROUTER_OBJECT
  $route: Object
  $router: Object
  // 配置vue router实例
  makeVueRouter () {
    if (!this.$route || !this.$router) throw new Error('路由api依赖 vue router')
    this.router = Object.assign(this.$router, this.$route)
    this.router.pop = _ => history.back()
    // 重写push 方法 当传入string时直接作为path
  }

  // 将props指向vue父组件实例
  translateToVueProps (option: COMPONENT_OBJECT_OPTION): void {
    var vueInstanceSelf: Object = this // this指向vue上的实例
    // add props
    if (!option.prop) return
    const PROPS = Object.assign({}, option.prop)
    option.props = option.props || {}
    Object.keys(PROPS).forEach(key => {
      if (option.props) option.props[key] = vueInstanceSelf[PROPS[key]]
    })
  }

  // 将methods指向vue父组件实例
  translateToVueMethods (option: COMPONENT_OBJECT_OPTION): void {
    var vueInstanceSelf: Object = this // this指向vue上的实例
    // add on
    if (option.on || !option.method) return
    const METHODS = Object.assign({}, option.method)
    option.on = {}
    Object.keys(METHODS).forEach(key => {
    if (option.on) option.on[key] = vueInstanceSelf[METHODS[key]]
    })
  }

}
