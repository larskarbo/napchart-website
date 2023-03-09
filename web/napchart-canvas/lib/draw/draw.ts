import bars from './content/bars'
import { NapchartType } from '../types'
import colorTags from './content/colorTags'
import handles from './content/handles'
import drawHandleTimes from './content/handleTimes'
import { drawDistances } from './content/distances'
import { drawLabels } from './content/labels'
import { drawPen } from './content/pen'
import { drawDurations } from './content/durations'
import { drawCircles } from './face/circles'
import { drawBackground } from './face/background'
import { drawLines } from './face/lines'
import { drawNumbers } from './face/numbers'

import { textHelper } from './textHelper'
import { clearChart } from './clear'

export let isNode

try {
  isNode = typeof window == 'undefined'
} catch (e) {
  isNode = true
}

export function fullDraw(chart, noocanvasplease = false) {
  var ctx = chart.ctx

  ctx.font = chart.config.fontSize + 'px ' + chart.config.font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  clearChart(chart)

  const drawFaceTasks = (chart: NapchartType) => {
    // -- circles
    drawCircles(chart)
    // -- circles
    drawBackground(chart)
    // -- lines
    drawLines(chart)

    // -- numbers
    drawNumbers(chart)
  }
  if (isNode || noocanvasplease) {
    // we are in a node environment
    // dont do the offscreen thing
    drawFaceTasks(chart)

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
    var faceChart = {
      ...chart,
      ctx: octx,
    }
    drawFaceTasks(faceChart)

    drawFrameFunctions(chart)
  }
}

// mini function that draws only the things
// that usually change
// (does not update clock-face, settings, shape etc)
export function drawFrame(chart) {
  clearChart(chart)

  drawFrameFunctions(chart)
}

function drawFrameFunctions(chart: NapchartType) {
  if (typeof chart.ocanvas !== 'undefined') {
    chart.ctx.drawImage(chart.ocanvas, 0, 0)
  }

  bars(chart)

  handles(chart)

  // end
  colorTags(chart)

  drawDistances(chart)

  // -- handleTimes
  drawHandleTimes(chart)

  // -- text
  drawLabels(chart)

  // -- durations
  drawDurations(chart)

  // -- pen
  drawPen(chart)

  textHelper.writeAll(chart)
}
