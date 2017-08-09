import type {
  VUE_INSTANCE,
  CONSTRUCTOR_OPTION
} from './type'

import getLifeCycle from './lifeCycle'
import getRender from './render'
import mixins from './mixins'

export default class VueCompile {

  constructor (option: CONSTRUCTOR_OPTION): VUE_INSTANCE {
    return this.getInstance(option)
  }

  // 生成vue实例
  getInstance (option: CONSTRUCTOR_OPTION): VUE_INSTANCE {
    const render = getRender(option)
    const data = option.data || {}
    return Object.assign(getLifeCycle(option.lifeCycle), {
      mixins: [mixins],
      methods: option.method,
      data: _ => data,
      render
    })
  }

}
