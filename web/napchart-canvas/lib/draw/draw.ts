// const bars = require('./content/bars2').default

import bars from './content/bars'
import { chart } from '../types'
import colorTags from './content/colorTags'
import handles from './content/handles'

export let isNode

try{
  isNode = typeof window == "undefined"
} catch(e) {
  isNode = true
}

// textHelper
var textHelper = require('./textHelper')

var clear = require('./clear')

var tasks = [
  // -- handleTimes
  require('./content/handleTimes'),
  // -- text
  require('./content/text'),
  // -- durations
  require('./content/durations'),
  // -- distances
  require('./content/distances'),
  // -- pen
  require('./content/pen'),
  // -- text strings
  textHelper.writeAll,
]

var faceTasks = [
  // -- circles
  require('./face/background'),
  // -- circles
  require('./face/circles'),
  // -- lines
  require('./face/lines'),
  // -- numbers
  require('./face/numbers'),
]

export function fullDraw(chart, noocanvasplease = false) {
  var ctx = chart.ctx

  ctx.font = chart.config.fontSize + 'px ' + chart.config.font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  clear(chart)

  if (isNode || noocanvasplease) {
    // we are in a node environment
    // dont do the offscreen thing
    faceTasks.forEach(function (task) {
      task(chart)
    })

    drawFrameFunctions(chart)
  } else {
    chart.ocanvas = document.createElement('canvas')
    chart.ocanvas.width = chart.width
    chart.ocanvas.height = chart.height
    var octx = chart.ocanvas.getContext('2d')

    // here I create a sligthly modified chart object faceChart
    // please don't get confused by this, you should really
    // just think that there is one chart object to rule
    // them all (each instance)
    var faceChart = Object.assign({}, chart, { ctx: octx })
    faceTasks.forEach(function (task) {
      task(faceChart, octx)
    })

    drawFrameFunctions(chart)
  }
}

// mini function that draws only the things
// that usually change
// (does not update clock-face, settings, shape etc)
export function drawFrame(chart) {
  clear(chart)

  drawFrameFunctions(chart)
}

function drawFrameFunctions(chart: chart) {
  if (typeof chart.ocanvas !== 'undefined') {
    chart.ctx.drawImage(chart.ocanvas, 0, 0)
  }

  bars(chart)

  handles(chart)

  // end
  colorTags(chart)

  tasks.forEach(function (task) {
    task(chart)
  })

}
