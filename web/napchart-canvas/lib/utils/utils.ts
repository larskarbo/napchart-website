// private
import { Element } from '../../../src/components/Editor/types'
import { baseConfig, NapchartConfig } from '../baseConfig'
import { drawFrame, fullDraw } from '../draw/draw'
import { clone, deepEach } from '../helperFunctions'
import { initShape } from '../shape/shape'
import { NapchartType } from '../types'
export function scale(chart) {
  var canvas = chart.canvas
  retinaScale(chart)
  chart.width = chart.w = canvas.width
  chart.height = chart.h = canvas.height
  chart.ratio = Math.min(chart.w / 90, chart.h / 90)
  chart.config = scaleConfig(chart.unScaledConfig, chart.ratio)
}

export function retinaScale(chart) {
  if (typeof window === 'undefined') {
    // we are in node.js
    return
  }
  var canvas = chart.canvas
  var dpr = window.devicePixelRatio

  var _parent = canvas.parentNode
  var WIDTH = _parent.offsetWidth
  var HEIGHT = _parent.offsetHeight

  canvas.width = dpr * WIDTH
  canvas.height = dpr * HEIGHT

  canvas.style.width = '100%'
  canvas.style.height = '100%'
}

export function enableResponsiveness(chart) {
  const resizeFunction = () =>
    setTimeout(() => {
      scale(chart)
      initShape(chart)
      fullDraw(chart)
    }, 200)

  window.addEventListener('resize', resizeFunction)

  chart.destroyers.push(() => {
    window.removeEventListener('resize', resizeFunction)
  })
}

export function draw(chart: NapchartType) {
  // here we need to determine how much we should redraw
  if (chart.needFullRedraw) {
    fullDraw(chart)
    chart.needFullRedraw = false
    chart.onUpdate() // notify listenersø
  } else {
    drawFrame(chart)
  }
}

export function initConfig(config: Partial<NapchartConfig>) {
  config = {
    ...JSON.parse(JSON.stringify(baseConfig)),
    ...config,
  }
  return config
}

export function verifyAndInitElements(elements: Partial<Element>[], chart: NapchartType) {
  return elements.map((element) => {
    if (typeof element.start === 'undefined' || typeof element.end === 'undefined') {
      throw new Error('Start and End properties are required!')
    }
    // @ts-ignore
    var element = {
      start: element.start,
      end: element.end,
      id: element.id || idGen(),
      lane: element.lane || 0,
      text: element.text || '',
      color: element.color || chart.config.defaultColor,
    }
    if (element.lane > chart.shape.lanes.length - 1) {
      console.log(`Lane no. ${element.lane} does not exist in this chart.
        Number of lanes: ${chart.shape.lanes.length}`)
    }

    return element
  })

  function idGen() {
    var id = Math.round(Math.random() * 10000)
    return id
  }
}

export function scaleConfig(config, ratio) {
  var scaledConfig = clone(config)

  function scaleFn(base, value, key) {
    if (value > 1 || value < 1 || value === 1) {
      // if value is a number
      base[key] = value * ratio
    }
  }
  deepEach(scaledConfig, scaleFn)
  return scaledConfig
}
