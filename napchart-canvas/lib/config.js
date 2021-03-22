/*
 *  config
 *
 *  All entries that are numbers will be scaled in core.js
 *
 */

const { baseConfig } = require('./baseConfig')

module.exports = function (Napchart) {
  Napchart.config = baseConfig
}
