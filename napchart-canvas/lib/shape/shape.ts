/*
 *
 * Shape module
 *
 */

import { clone } from '../helperFunctions'
import { calculateShape } from './calculateShape'
import initedShapes from './shapes2'
import { animateShape } from './animateShape';

var currentShape
export const initShape = (chart) => {
  let shape = chart.data.shape
  if (typeof shape === 'string') {
    currentShape = shape
    shape = initedShapes[shape]
  }
  chart.shape = calculateShape({
    baseShapeObject: shape,
    config: chart.config,
    ratio: chart.ratio,
    width: chart.width,
    height: chart.height,
    numLanes: chart.data.lanes,
  })
}

export const changeShape = (chart, wantToShape) => {
  // we are this shape:
  var currentShape = chart.data.shape

  // make a sequence of shapes for smoother animations
  var shapeSequenze = [wantToShape] // default to direct
  if (currentShape == 'circle') {
    if (wantToShape == 'line') {
      shapeSequenze = ['transitionShape', 'line']
    }
  } else if (currentShape == 'wide') {
    if (wantToShape == 'line') {
      shapeSequenze = ['circle', 'transitionShape', 'line']
    }
  } else if (currentShape == 'line') {
    if (wantToShape == 'wide') {
      shapeSequenze = ['transitionShape', 'circle', 'wide']
    } else if (wantToShape == 'circle') {
      shapeSequenze = ['transitionShape', 'circle']
    }
  }

  var index = 0
  function next() {
    var oldShape = clone(initedShapes[currentShape])
    var newShape = clone(initedShapes[shapeSequenze[index]])
    var globalProgress = {
      count: shapeSequenze.length,
    }
    animateShape(chart, oldShape, newShape, globalProgress, function () {
      currentShape = shapeSequenze[index]
      index++
      if (index < shapeSequenze.length) {
        next()
      }
    })
  }

  next()
}
