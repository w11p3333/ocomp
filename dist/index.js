import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Object$assign from 'babel-runtime/core-js/object/assign';

// 组件数组

// 组件配置项的数据类型

// vue实例的数据类型
var VueCompile = function VueCompile(option) {
  return this.makeVueInstance(option);
};

// 生成vue实例
VueCompile.prototype.makeVueInstance = function makeVueInstance (option) {
  var render = this.makeVueRender(option.component);
  return {
    methods: option.method || {},
    data: function (_) { return option.data || {}; },
    render: render
  };
};

// vue实现 render
VueCompile.prototype.makeVueRender = function makeVueRender (components) {
  var classSelf = this; // this指向类
  return function (createElement) {
    var vueInstanceSelf = this; // this指向vue实例
    classSelf.makeVueRouter.call(vueInstanceSelf);
    // div作为父组件包裹
    return createElement('div', components.map(function (ref) {
        var components = ref.components;
        var option = ref.option;

      if (option) {
        // 遍历以转换格式为vue组件配置格式
        classSelf.translateToVueProps.call(vueInstanceSelf, option);
        classSelf.translateToVueMethods.call(vueInstanceSelf, option);
        return createElement(components, option); // 若存在组件配置
      } else {
        return createElement(components); // 不存在组件配置
      }
    }));
  };
};

// 配置vue router实例
VueCompile.prototype.makeVueRouter = function makeVueRouter () {
  if (!this.$route || !this.$router) { throw new Error('路由api依赖 vue router'); }
  this.router = _Object$assign(this.$router, this.$route); // 将vue router中的router route对象 混合
  this.router.pop = function (_) { return history.back(); };
};

// 将props指向vue父组件实例
VueCompile.prototype.translateToVueProps = function translateToVueProps (option) {
  var vueInstanceSelf = this; // this指向vue上的实例
  if (!option.prop) { return; }
  var PROPS = _Object$assign({}, option.prop);
  option.props = option.props || {};
  _Object$keys(PROPS).forEach(function (key) {
    if (option.props) { option.props[key] = vueInstanceSelf[PROPS[key]]; }
  });
};

// 将methods指向vue父组件实例
VueCompile.prototype.translateToVueMethods = function translateToVueMethods (option) {
  var vueInstanceSelf = this; // this指向vue上的实例
  if (option.on || !option.method) { return; }
  var METHODS = _Object$assign({}, option.method);
  option.on = {};
  _Object$keys(METHODS).forEach(function (key) {
    if (option.on) { option.on[key] = vueInstanceSelf[METHODS[key]]; }
  });
};


// 传入的实例化参数

// 组件的数据类型

// vue路由实例

var OComp = function OComp(option) {
  this.VUE_COMPONENTS = 'vue';
  this.WX_COMPONENTS = 'wx';
  this.type = [this.VUE_COMPONENTS, this.WX_COMPONENTS];
  return this.render(option);
};

// 渲染
OComp.prototype.render = function render (option) {
  if (!option) { throw new Error('构造参数不存在'); }
  var componentsArr = option.component;
  if (!componentsArr || !Array.isArray(componentsArr)) { throw new Error('组件列表必须为数组'); }
  var TYPE = process.env.COMPILE_ENV;
  if (!(this.type.indexOf(TYPE) > -1)) { throw new Error('组件类型错误'); }
  if (TYPE === this.VUE_COMPONENTS) { return new VueCompile(option); }
};

export default OComp;
