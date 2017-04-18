'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));

// 组件数组

// 组件配置项的数据类型

// vue实例的数据类型
var VueCompile = function VueCompile(option) {
  return this.makeVueInstance(option);
};

// 生成vue实例
VueCompile.prototype.makeVueInstance = function makeVueInstance (option) {
  var render = this.makeVueRender(option.component);
  var newMethod = option.method || {};
  var oldData = option.data || {};
  var newData = _Object$assign({}, oldData);
  newData.data = oldData;
  newMethod.setData = function (obj) {
    var vueInstanceSelf = this;
    _Object$keys(obj).forEach(function (key) {
      if (vueInstanceSelf[key]) {
        vueInstanceSelf[key] = obj[key];
        vueInstanceSelf['data'][key] = obj[key];
      }
    });
  };
  return {
    methods: newMethod,
    data: function (_) { return newData; },
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
    return createElement('div', classSelf.getContainerStyle(), components.map(function (ref) {
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

// 获取container的样式
VueCompile.prototype.getContainerStyle = function getContainerStyle () {
  return {
    attrs: {
      id: 'main-container',
      class: 'main-container'
    },
    style: {
      'margin-top': 0,
      'margin-bottom': 0,
      'margin-left': 0,
      'margin-right': 0,
      'background-color': '#f0eff5'
    }
  };
};

// 配置vue router实例
VueCompile.prototype.makeVueRouter = function makeVueRouter () {
  var TYPE = process.env.COMPILE_ENV;
  if (TYPE === 'vue') {
    if (!this.$route || !this.$router) { throw new Error('vue路由api依赖 vue-router'); }
    this.router = _Object$assign(this.$router, this.$route); // 将vue router中的router route对象 混合
    this.router.pop = function (_) { return history.back(); };
  } else if (TYPE === 'weex') {
    this.router = {};
    this.router.push = function (path) {
      var navigator = weex.requireModule('navigator');
      if (!navigator) {
        throw new Error('weex路由api依赖 weex navigator');
      }
      var url = weex.config.bundleUrl; //獲取當前a.we頁面的路徑(xxx/a.js)
      url = url.split('/').slice(0, -1).join('/') + path + '.js'; //獲取b.we編譯後的b.js的相對路徑
      navigator.push({
        url: url,
        animated: "true"
      });
    };
    this.router.pop = function (_) {
      navigator.pop({
        animated: "true"
      });
    };
  }
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

/**
 * Created by zhangyi on 2017/4/12.
 * Desc: ocmp
 */

function OComp$2(options) {
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

OComp$2.prototype.render = function () {
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

OComp$2.prototype.getData = function () {
    return this.data;
};

OComp$2.prototype.getMethod = function () {
    return this.method;
};

var OComp = function OComp(option) {
  this.VUE_COMPONENTS = 'vue';
  this.WX_COMPONENTS = 'wx';
  this.WEEX_COMPONENTS = 'weex';
  var type = [this.VUE_COMPONENTS, this.WX_COMPONENTS, this.WEEX_COMPONENTS];

  if (!option) { throw new Error('构造参数不存在'); }
  var componentsArr = option.component;
  if (!componentsArr || !Array.isArray(componentsArr)) { throw new Error('组件列表必须为数组'); }

  var TYPE = process.env.COMPILE_ENV;
  if (!(type.indexOf(TYPE) > -1)) { throw new Error('组件类型错误'); }

  if (TYPE === this.VUE_COMPONENTS || TYPE === this.WEEX_COMPONENTS) { return new VueCompile(option); }else if (TYPE === this.WX_COMPONENTS) { return new OComp$2(option); }
};

module.exports = OComp;
