// @flow
type VUE_STYLE = {
  attrs: {
    id: string,
    class: string
  },
  style: Object
}

const baseStyle = {
  'margin-top': 0,
  'margin-bottom': 0,
  'margin-left': 0,
  'margin-right': 0
}

export default function (style: Object): VUE_STYLE {
  return {
    attrs: {
      id: 'main-container',
      class: 'main-container'
    },
    style: Object.assign(baseStyle, style)
  }
}