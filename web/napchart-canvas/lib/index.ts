import init from './core'
import helpers from './helpers'
import setConfig from './config'

var Napchart = {} as {
  helpers: typeof helpers
  init: typeof init
}
Napchart.helpers = helpers

setConfig(Napchart)

export default {
  ...Napchart,
  init,
}
