/**
 *
 * function calculateShape
 *
 * This function takes a normal shape definition object
 * and calculates positions and sizes
 *
 * Returns a more detailed shape object that is later
 * assigned to chart.shape and used when drawing
 *
 */

import { limit } from '../helperFunctions'

export function calculateShape({ config, height, width, baseShapeObject, ratio, numLanes }) {
  // apply defaults
  var shape = baseShapeObject

  /**
   * Find out totalRadians
   * This be 2 * PI if the shape is circular
   */

  var totalRadians = 0
  shape.elements.forEach(function (element) {
    if (element.type === 'arc') {
      totalRadians += element.radians
    }
  })

  /**
   * Is shape continous?
   * TODO:Maybe we should keep this config in the shape object somehow
   */
  if (totalRadians == 2 * Math.PI) {
    // chart.shapeIsContinous = true
  } else {
    // chart.shapeIsContinous = false
  }

  /**
   * Find out angle of shapes
   */

  shape.elements.forEach(function (element, i) {
    if (i === 0) element.startAngle = 0
    else element.startAngle = shape.elements[i - 1].endAngle

    if (element.type === 'arc') {
      element.endAngle = element.startAngle + element.radians
    } else if (element.type === 'line') {
      element.endAngle = element.startAngle
    }
  })

  /**
   * Find out length of the shapes
   *
   * Perimeter of circle = 2 * radius * PI
   */

  // how much space do we have for lines?
  var space = width
  // paddings
  space -= 120

  // arcs
  shape.elements.forEach(function (element, i) {
    if (element.type === 'arc') {
      space -= config.edgeRadius * (element.radians / Math.PI)
    }
  })

  if (space < 0) {
    space = 0
  }

  var totalLength = 0
  shape.elements.forEach(function (element, i) {
    if (element.type === 'arc') {
      element.length = element.radians * config.baseRadius
    } else if (element.type === 'line') {
      element.length = space * (element.percent / 100)
    }

    element.length = Math.round(element.length)
    totalLength += element.length
  })

  /**
   * Calculate how many minutes each element should get
   */

  var totalMinutes = 0
  shape.elements.forEach(function (element, i) {
    element.minutes = Math.floor((element.length / totalLength) * 1440)
    totalMinutes += element.minutes
    if (i == shape.elements.length - 1 && totalMinutes < 1440) {
      totalMinutes -= element.minutes
      element.minutes = 1440 - totalMinutes
      totalMinutes += element.minutes
    }
  })

  if (totalMinutes != 1440) {
  }

  /**
   * Delete elements that have 0 minutes
   */

  shape.elements = shape.elements.filter((element) => element.minutes > 0)

  /**
   * Ok, so totalMinutes is now 1440
   * Now we need to create a .start and .end point on all
   * the shape elements
   */

  shape.elements.forEach(function (element, i) {
    if (i === 0) element.start = shape.shift
    else if (i > 0) element.start = shape.elements[i - 1].end
    element.end = limit(element.start + element.minutes)
  })

  /**
   * Calculate startPoints and endPoints
   * First point is center
   * The point only changes on line-segments
   */

  var center = {
    x: width / 2,
    y: height / 2,
  }
  shape.elements.forEach(function (element, i) {
    if (i === 0) {
      element.startPoint = center
      element.endPoint = center
    } else if (element.type === 'arc') {
      element.startPoint = shape.elements[i - 1].endPoint
      element.endPoint = shape.elements[i - 1].endPoint
    } else if (element.type === 'line') {
      element.startPoint = shape.elements[i - 1].endPoint
    }
    if (element.type === 'line') {
      element.endPoint = {
        x: element.startPoint.x + Math.cos(element.startAngle) * element.length,
        y: element.startPoint.y + Math.sin(element.startAngle) * element.length,
      }
    }
  })

  /**
   * Center the shape
   */

  var limits = {}

  function pushLimits(point) {
    if (Object.keys(limits).length === 0) {
      limits = {
        up: point.y,
        down: point.y,
        left: point.x,
        right: point.x,
      }
    } else {
      if (point.y < limits.up) limits.up = point.y
      if (point.y > limits.down) limits.down = point.y
      if (point.x < limits.left) limits.left = point.x
      if (point.x > limits.right) limits.right = point.x
    }
  }
  shape.elements.forEach(function (element, i) {
    pushLimits(element.startPoint)
    pushLimits(element.endPoint)
  })

  // we need to know the distances to the edge of the canvas
  limits.down = height - limits.down
  limits.right = width - limits.right

  // the distances should be equal, therefore, shift the points
  // if it is not
  var shiftLeft = (limits.left - limits.right) / 2
  var shiftUp = (limits.up - limits.down) / 2

  // apply shiftDown setting from shape (useful for line shape)
  shiftUp = shiftUp - shape.shiftDown * ratio

  shape.elements.forEach(function (element, i) {
    element.startPoint = {
      x: element.startPoint.x - shiftLeft,
      y: element.startPoint.y - shiftUp,
    }
    element.endPoint = {
      x: element.endPoint.x - shiftLeft,
      y: element.endPoint.y - shiftUp,
    }
  })

  // create lanes based on how many
  shape.lanes = []

  if (typeof numLanes == 'undefined' || numLanes == 0) {
  }
  var maxLaneSize = shape.maxLaneSize * ratio
  var laneMaxRadius = shape.laneMaxRadius * ratio
  var laneMinRadius = shape.laneMinRadius * ratio
  var spaceForLanes = laneMaxRadius - laneMinRadius
  var sizeEachLane = Math.min(maxLaneSize, spaceForLanes / numLanes)
  var marginRadius = spaceForLanes - sizeEachLane * numLanes + laneMinRadius
  for (var i = 0; i < numLanes; i++) {
    shape.lanes.push({
      start: marginRadius + sizeEachLane * i,
      end: marginRadius + sizeEachLane * (i + 1),
    })
  }

  return shape
}
