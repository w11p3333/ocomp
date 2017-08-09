'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var _Reflect$set = _interopDefault(require('babel-runtime/core-js/reflect/set'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _Reflect$defineProperty = _interopDefault(require('babel-runtime/core-js/reflect/define-property'));
var _Reflect$get = _interopDefault(require('babel-runtime/core-js/reflect/get'));
var _Reflect$has = _interopDefault(require('babel-runtime/core-js/reflect/has'));
var _Map = _interopDefault(require('babel-runtime/core-js/map'));

var getLifeCycle = function (lifeCycle) {
  return lifeCycle ? {
    created: lifeCycle.init,
    mounted: lifeCycle.ready,
    destoryed: lifeCycle.destory
  } : {};
};

// 将props指向vue父组件实例
var getProps = function (vueInstance, props) {
    if (!props) { return; }
    var newProps = {};
    _Object$keys(props).forEach(function (key) {
        var value = props[key];
        var prop = typeof value === 'string' && value.indexOf('$') === 0 ? vueInstance[value.substring(1, value.length)] : value;
        // 若是以$开头则为变量
        _Reflect$set(newProps, key, prop);
    });
    return newProps;
};

// 将methods指向vue父组件实例
var getMethods = function (vueInstance, methods) {
    if (!methods) { return; }
    var newMethod = {};
    _Object$keys(methods).forEach(function (key) {
        var value = methods[key];
        if (!value.indexOf('$') === 0) { throw new Error('定义组件的method 必须使用$开头的字符串表示变量'); }
        _Reflect$set(newMethod, key, vueInstance[value.substring(1, value.length)]);
    });
    return newMethod;
};

var baseStyle = {
  'margin-top': 0,
  'margin-bottom': 0,
  'margin-left': 0,
  'margin-right': 0
};


var getContainerStyle = function (style) {
  return {
    attrs: {
      id: 'main-container',
      class: 'main-container'
    },
    style: _Object$assign(baseStyle, style)
  };
};

// 生成vue render方法
var getRender = function (option) {
  var components = option.component;

  function render(vueInstance, h, components, option) {
    if (option) {
      var prop = option.prop;
      var method = option.method;
      return h(components, {
        props: getProps(vueInstance, prop),
        on: getMethods(vueInstance, method)
      }); // 若存在组件配置
    } else { return h(components); } // 不存在组件配置
  }

  return function (h) {
    var vueInstance = this; // this指向vue实例
    return Array.isArray(components) ? h('div', getContainerStyle(option.style), components.map(function (ref) {
      var components = ref.components;
      var option = ref.option;

      return render(vueInstance, h, components, option);
    })) : render(vueInstance, h, components.components, components.option);
  };
};

// 配置vue router 实例
var getRouter = function (vueInstance) {
  var TYPE = process.env.COMPILE_ENV;
  var router = {};
  var pushHandler = {};
  var popHandler = {};
  if (TYPE === 'vue') {
    if (!vueInstance.$route || !vueInstance.$router) { throw new Error('vue路由api依赖 vue-router'); }
    popHandler = {
      get: function (_) { return function (_) { return history.back(); }; }
    };
    router = _Object$assign(vueInstance.$router, vueInstance.$route);
  } else if (TYPE === 'weex') {
    var navigator = weex.requireModule('navigator');
    if (!navigator) { throw new Error('weex路由api依赖 weex navigator'); }
    pushHandler = {
      get: function (_) { return function (path) {
        var navigator = weex.requireModule('navigator');
        if (!navigator) { throw new Error('weex路由api依赖 weex navigator'); }
        var url = weex.config.bundleUrl.split('/').slice(0, -1).join('/') + '/' + path + '.js'; // 将a.js的绝对地址转为b.js的绝对地址
        navigator.push({ url: url, animated: "true" });
      }; }
    };
    popHandler = {
      get: function (_) { return function (_) { return navigator.pop({ animated: 'true' }); }; }
    };
    // 添加push对象
    _Reflect$defineProperty(router, 'push', pushHandler);
  }
  // 添加pop对象
  _Reflect$defineProperty(router, 'pop', popHandler);
  return router;
};

// vue实例上挂载自定义对象

var defineInstanceProperty = function (vueInstance) {
  var properties = new _Map();
  // 定义setData
  properties.set('setData', {
    // 调用setData时遍历挂载在vue实例下的data 并赋值
    get: function (_) { return function (obj) { return _Object$keys(obj).map(function (key) { return _Reflect$has(vueInstance, key) && _Reflect$set(vueInstance, key, obj[key]); }); }; }
  });
  // 定义data proxy 对象
  properties.set('data', {
    get: function (_) { return vueInstance; }
  });
  // 定义fetch 对象
  properties.set('fetch', {
    get: function (_) { return weex.requireModule('stream').fetch; }
  });
  // 定义config 对象
  properties.set('config', {
    get: function (_) { return weex.config; }
  });
  // 定义router 对象
  properties.set('router', {
    get: function (_) { return getRouter(vueInstance); }
  });
  // 遍历并定义
  properties.forEach(function (handler, name) {
    _Reflect$get(vueInstance, name) === undefined && _Reflect$defineProperty(vueInstance, name, handler);
  });
};

var mixins = {
  beforeCreate: function beforeCreate() {
    defineInstanceProperty(this);
  }
};

var VueCompile = function VueCompile(option) {
  return this.getInstance(option);
};

// 生成vue实例
VueCompile.prototype.getInstance = function getInstance (option) {
  var render = getRender(option);
  var data = option.data || {};
  return _Object$assign(getLifeCycle(option.lifeCycle), {
    mixins: [mixins],
    methods: option.method,
    data: function (_) { return data; },
    render: render
  });
};

/**
 * Created by zhangyi on 2017/4/12.
 * Desc: ocmp
 */

function OComp$1(options) {
    var this$1 = this;

    if (!options.data) {
        throw new Error('no data');
    }

    this.data = options.data;

    for (var key in this$1.data) {
        this$1[key] = this$1.data[key];
    }

    if (!options.method) {
        throw new Error('no method');
    }

    this.method = options.method;

    for (var key$1 in this$1.method) {
        this$1[key$1] = this$1.method[key$1];
    }

    if (options.component) {
        this.component = options.component;
    } else {
        this.component = [];
    }
}

OComp$1.prototype.render = function () {
    var components = this.component;
    var html = '';
    var css = '';
    var data = {};
    var method = {};

    for (var i = 0; i < components.length; i++) {
        var component = components[i];
        var comp = component.components;

        html = html + "\n" + (comp.html) + "\n";
        //外部属性替换
        if (component.hasOwnProperty('option') && component.option && component.option.hasOwnProperty('prop')) {

            var props = component.option.prop;

            for (var key in props) {
                var prop = props[key];

                html = html.replace(new RegExp(("{{" + key + "}}"), 'g'), ("{{ " + prop + " }}"));
                html = html.replace(new RegExp(("{{ " + key + " }}"), 'g'), ("{{ " + prop + " }}"));
            }
        }

        //内部属性
        if (comp.hasOwnProperty('data')) {
            var _data = comp.data;

            for (var key$1 in _data) {
                var name = "OCOMP_" + i + "_DATA_" + key$1;

                html = html.replace(new RegExp(("{{" + key$1 + "}}"), 'g'), ("{{ " + name + " }}"));
                html = html.replace(new RegExp(("{{ " + key$1 + " }}"), 'g'), ("{{ " + name + " }}"));

                data[name] = _data[key$1];
            }
        }

        //内部函数
        if (comp.hasOwnProperty('method')) {
            var _methods = comp.method;
            var idx = 0;

            for (var key$2 in _methods) {
                var name$1 = "OCOMP_" + i + "_METHOD_" + idx;

                html = html.replace(new RegExp(("{{" + key$2 + "}}"), 'g'), ("{{ " + name$1 + " }}"));
                html = html.replace(new RegExp(("{{ " + key$2 + " }}"), 'g'), ("{{ " + name$1 + " }}"));

                var method_str = _methods[key$2].toString();

                if (comp.hasOwnProperty('data')) {
                    var _data$1 = comp.data;

                    for (var key$3 in _data$1) {
                        var name$2 = "OCOMP_" + i + "_DATA_" + key$3;
                        method_str = method_str.replace(new RegExp(key$3, 'g'), name$2);
                    }
                }

                if (component.hasOwnProperty('option') && component.option && component.option.hasOwnProperty('method')) {

                    var outer_methods = component.option.method;

                    for (var key$4 in outer_methods) {
                        var outer_method = outer_methods[key$4];
                        method_str = method_str.replace(new RegExp('\\$' + key$4, 'g'), outer_method);
                    }
                }

                html = html.replace(new RegExp(key$2, 'g'), name$1);
                method[name$1] = method_str;

                idx++;
            }
        }

        // 外部函数替换
        // if(component.hasOwnProperty('option') && component.option &&
        //     component.option.hasOwnProperty('method')) {
        //
        //     let methods = component.option.method
        //
        //     for(let key in methods) {
        //         let method = methods[key]
        //
        //         html = html.replace(new RegExp(key, 'g'), method)
        //         html = html.replace(new RegExp(key, 'g'), method)
        //     }
        // }

        css = css + "\n" + (comp.css) + "\n";
    }

    return {
        html: html,
        css: css,
        data: data,
        method: method
    };
};

OComp$1.prototype.getData = function () {
    return this.data;
};

OComp$1.prototype.getMethod = function () {
    return this.method;
};

var OComp = function OComp(option) {
  this.VUE_COMPONENTS = 'vue';
  this.WX_COMPONENTS = 'wx';
  this.WEEX_COMPONENTS = 'weex';
  var type = [this.VUE_COMPONENTS, this.WX_COMPONENTS, this.WEEX_COMPONENTS];

  if (!option) { throw new Error('构造参数不存在'); }
  var componentsArr = option.component;
  if (!componentsArr) { throw new Error('组件不存在'); }

  var TYPE = process.env.COMPILE_ENV;
  if (!(type.indexOf(TYPE) > -1)) { throw new Error('组件类型错误'); }

  if (TYPE === this.VUE_COMPONENTS || TYPE === this.WEEX_COMPONENTS) { return new VueCompile(option); }else if (TYPE === this.WX_COMPONENTS) { return new OComp$1(option); }
};

var Component = function Component(ref, option) {
  var weexComponent = ref.weexComponent;

  this.components = weexComponent;
  this.option = option;
};

exports.OComp = OComp;
exports.Component = Component;
