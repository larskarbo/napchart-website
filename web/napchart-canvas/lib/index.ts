import init from './core'
import helpers from './helpers'
import setConfig from './config'

var Napchart = {}
Napchart.helpers = helpers

setConfig(Napchart)

export default {
  ...Napchart,
  init,
}
