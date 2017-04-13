import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Object$assign from 'babel-runtime/core-js/object/assign';

// 组件数组

// 组件配置项的数据类型

// vue实例的数据类型
var VueCompile = function VueCompile(option) {
  this.option = option;
  return this.renderVue(option.component);
};

// vue实现 render
VueCompile.prototype.renderVue = function renderVue (components) {
  var classSelf = this; // this指向类
  var render = function (h) {
    var vueSelf = this; // this指向vue实例
    classSelf.getVueRouter.call(vueSelf);
    return h('div', components.map(function (ref) {
        var components = ref.components;
        var option = ref.option;

      if (option) {
        // 遍历以转换格式为vue组件配置格式
        classSelf.getVueProps.call(vueSelf, option);
        classSelf.getVueMethods.call(vueSelf, option);
        return h(components, option);
      } else {
        return h(components);
      }
    }));
  };
  return classSelf.getVueOptions(render);
};

// 配置vue router实例
VueCompile.prototype.getVueRouter = function getVueRouter () {
  if (!this.$route || !this.$router) { throw new Error('路由api依赖 vue router'); }
  this.router = _Object$assign(this.$router, this.$route);
  this.router.pop = function (_) { return history.back(); };
  // 重写push 方法 当传入string时直接作为path
};

// 将props指向vue父组件实例
VueCompile.prototype.getVueProps = function getVueProps (option) {
  var vueSelf = this; // this指向vue上的实例
  // add props
  if (!option.prop) { return; }
  var PROPS = _Object$assign({}, option.prop);
  option.props = option.props || {};
  _Object$keys(PROPS).forEach(function (key) {
    if (option.props) { option.props[key] = vueSelf[PROPS[key]]; }
  });
};

// 将methods指向vue父组件实例
VueCompile.prototype.getVueMethods = function getVueMethods (option) {
  var vueSelf = this; // this指向vue上的实例
  // add on
  if (option.on || !option.method) { return; }
  var METHODS = _Object$assign({}, option.method);
  option.on = {};
  _Object$keys(METHODS).forEach(function (key) {
    if (option.on) { option.on[key] = vueSelf[METHODS[key]]; }
  });
};

// 生成vue实例
VueCompile.prototype.getVueOptions = function getVueOptions (render) {
  if (this.option) {
    var newData = this.option.data;
    return {
      methods: this.option.method,
      data: function (_) { return newData; },
      render: render
    };
  } else {
    return {
      methods: {},
      data: function (_) {},
      render: render
    };
  }
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
  var componentsArr = option.component;
  if (!componentsArr || !Array.isArray(componentsArr)) { throw new Error('组件列表必须为数组'); }
  var TYPE = process.env.COMPILE_ENV;
  if (!(this.type.indexOf(TYPE) > -1)) { throw new Error('组件类型错误'); }
  if (TYPE === this.VUE_COMPONENTS) { return new VueCompile(option); }
};

export default OComp;
