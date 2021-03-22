var Napchart = {}

/* helper functions */
const helpers = require('./helpers').default

Napchart.helpers = helpers

/* config file */
require('./config')(Napchart)

/* core and init */
require('./core')(Napchart)

/* drawing */
require('./draw/draw')(Napchart)

/* interaction */
require('./interactCanvas/interactCanvas')(Napchart)

/* history */
require('./history/history')(Napchart)

module.exports = Napchart
