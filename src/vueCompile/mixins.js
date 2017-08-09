// @flow
import defineInstanceProperty from './properties'

export default {
  beforeCreate () {
    defineInstanceProperty(this)
  }
}