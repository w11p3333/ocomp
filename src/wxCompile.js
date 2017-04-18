/**
 * Created by zhangyi on 2017/4/12.
 * Desc: ocmp
 */

function OComp(options) {
    if(!options.data) {
        throw new Error('no data')
    }

    this.data = options.data

    for(let key in this.data) {
        this[key] = this.data[key]
    }

    if(!options.method) {
        throw new Error('no method')
    }

    this.method = options.method

    for(let key in this.method) {
        this[key] = this.method[key]
    }

    if(options.component) {
        this.component = options.component
    }else{
        this.component = []
    }
}

OComp.prototype.render = function () {
    let components = this.component
    let html = ''
    let css = ''
    let data = {}
    let method = {}

    for(let i = 0; i < components.length; i ++) {
        let component = components[i]
        let comp = component.components

        html = `${html}
${comp.html}
`
        //外部属性替换
        if(component.hasOwnProperty('option') && component.option &&
            component.option.hasOwnProperty('prop')) {

            let props = component.option.prop

            for(let key in props) {
                let prop = props[key]

                html = html.replace(new RegExp(`{{${key}}}`, 'g'), `{{ ${prop} }}`)
                html = html.replace(new RegExp(`{{ ${key} }}`, 'g'), `{{ ${prop} }}`)
            }
        }

        //内部属性
        if(comp.hasOwnProperty('data')) {
            let _data = comp.data

            for(let key in _data) {
                let name = `OCOMP_${i}_DATA_${key}`

                html = html.replace(new RegExp(`{{${key}}}`, 'g'), `{{ ${name} }}`)
                html = html.replace(new RegExp(`{{ ${key} }}`, 'g'), `{{ ${name} }}`)

                data[name] = _data[key]
            }
        }

        //内部函数
        if(comp.hasOwnProperty('method')) {
            let _methods = comp.method
            let idx = 0

            for(let key in _methods) {
                let name = `OCOMP_${i}_METHOD_${idx}`

                html = html.replace(new RegExp(`{{${key}}}`, 'g'), `{{ ${name} }}`)
                html = html.replace(new RegExp(`{{ ${key} }}`, 'g'), `{{ ${name} }}`)

                let method_str = _methods[key].toString()

                if(comp.hasOwnProperty('data')) {
                    let _data = comp.data

                    for(let key in _data) {
                        let name = `OCOMP_${i}_DATA_${key}`
                        method_str = method_str.replace(new RegExp(key, 'g'), name)
                    }
                }

                if(component.hasOwnProperty('option') && component.option &&
                    component.option.hasOwnProperty('method')) {

                    let outer_methods = component.option.method

                    for(let key in outer_methods) {
                        let outer_method = outer_methods[key]
                        method_str = method_str.replace(new RegExp('\\$' + key, 'g'), outer_method)
                    }

                }

                html = html.replace(new RegExp(key, 'g'), name)
                method[name] = method_str

                idx++
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

        css = `${css}
${comp.css}
`
    }

    return {
        html: html,
        css: css,
        data: data,
        method: method
    }
}

OComp.prototype.getData = function () {
    return this.data
}

OComp.prototype.getMethod = function () {
    return this.method
}

export default OComp