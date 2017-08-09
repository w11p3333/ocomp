// @flow
// vue实例的数据类型
export type VUE_INSTANCE = {
   created: ?Function, 
   mounted: ?Function, 
   destoryed: ?Function, 
   data : ?Function, // 数据
   methods : ?Object, // 转换后的实例事件
   render : Function, // 实例render函数
}
// vue路由实例
export type ROUTER_OBJECT = {
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
export type COMPONENT_OBJECT_OPTION = {
  prop: ?Object, // 传入的组件参数
  props: ?Object, // 转换后的组件参数
  method: ?Object, // 传入的组件事件
  on: ?Object // 转换后的组件事件
}
// 组件的数据类型
export type COMPONENT_OBJECT = {
  components: Object,
  option: ?COMPONENT_OBJECT_OPTION
}
// 组件数组
export type COMPONENT_ARRAY = Array<COMPONENT_OBJECT>
// 传入的实例化参数
export type CONSTRUCTOR_OPTION = {
   data : ?Object, // 数据
   method : ?Object, // 传入的实例事件
   component: COMPONENT_ARRAY | COMPONENT_OBJECT, // 组件数组
   style: Object // container样式
}