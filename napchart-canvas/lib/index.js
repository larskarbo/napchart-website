var Napchart = {}
const init = require('./core').default

/* helper functions */
const helpers = require('./helpers').default

Napchart.helpers = helpers

/* config file */
require('./config')(Napchart)

module.exports = {
  ...Napchart,
  init: init,
}
